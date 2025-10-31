import type {
	AIShiftAdjustResponse,
	AIShiftSlot,
	AiModifiedType,
} from "@shared/api/shift/ai/types/post-adjust.js";
import type { AIShiftAdjustRequestInput } from "@shared/api/shift/ai/validations/post-adjust.js";
import openai from "../../../../config/openai.js";
import {
	backfillToCount,
	buildLockedSetAndStatus,
	ensureAbsoluteAssigned,
	hydrateAssignedFromProfiles,
	mergeCurrentAssignments,
	normalizeAiModified,
	sanitizeAiModified,
} from "./utils/index.js";

export const getAIShiftAdjustment = async ({
	datas,
}: {
	datas: AIShiftAdjustRequestInput;
}): Promise<AIShiftAdjustResponse> => {
	const {
		templateShift,
		submissions,
		currentAssignments,
		memberProfiles,
		constraints,
	} = datas;
	/** ---- システムプロンプト ---- */
	const systemPrompt = `
純JSONのみ。差分枠のみ返す（未変更枠は返さない）。updatedAt/updatedBy/sourceは出力禁止。
既存currentAssignmentsは変更不可（assignedの既存要素・statusは維持）。

候補条件:
- 提出で可用一致（"anytime"=全時間、一致は部分重なり）
- ロール適合: memberProfiles[uid].jobRoles ∩ requests[date][slot].jobRoles ≠ ∅
- 「提出で可用一致した候補に限定したうえで、absolute > priority(level昇順) > その他（userId昇順）の順に必ず選定する。等価条件の場合のタイブレークは jobRoles の適合度が高い候補を優先し、それも等しい場合のみ userId 昇順とする。」

優先順位（すべて可用一致・ロール適合が前提）:
1) absolute
2) priority（level昇順）
3) その他（ユーザーID昇順）

割り当て制約:
- 時間帯が重なる枠への同一ユーザーの同時割当は禁止
- assigned.length ≤ count、重複なし
- assignedCount = assigned.length
- vacancies = count - assigned.length (下限0)
- テンプレに存在しない [date][slot] は返さない
- 同一日の同一ユーザー重複アサイン禁止
- submissions[*].weekMax を超える割当は禁止

公平性・均等化（上位ルールに違反しない範囲で適用）:
- submissions[*].weekMin を満たしていないユーザーを優先（ただし可用一致/ロール適合が前提）
- 週内のユニーク割当人数を最大化する（可能なら全員に少なくとも1回）
- 同一ユーザーの週内割当回数の偏りを最小化（できるだけ均等配分）
- 同一日に既に割当があるユーザーより、その日未割当のユーザーを優先
- 等価条件なら userId 昇順（または同等の安定タイブレーク）で決定

返却形:
{"ai_modified":{"YYYY-MM-DD":{"HH:mm-HH:mm":{
  "name":"枠名","count":2,"jobRoles":["任意"],
  "assigned":[{"uid":"user_001","displayName":"氏名","pictureUrl":"URL","confirmed":true}],
  "assignedCount":1,"vacancies":1,"status":"proposed"
}}}}
`;

	/** ---- ユーザープロンプト ---- */
	const userPrompt = `
以下のデータに基づいて、最適なシフト調整案を生成してください。
出力は必ずJSONのみで返してください。

[雛形シフト]
${JSON.stringify(templateShift, null, 2)}

[提出データ]
${JSON.stringify(submissions, null, 2)}

[現状のアサイン状況]
${JSON.stringify(currentAssignments, null, 2)}

[制約]
${JSON.stringify(constraints ?? {}, null, 2)}
`;

	/** ---- OpenAI呼び出し ---- */
	const completion = await openai.chat.completions.create({
		model: "gpt-4o-mini",
		messages: [
			{ role: "system", content: systemPrompt },
			{ role: "user", content: userPrompt },
		],
		response_format: { type: "json_object" },
		temperature: 0.4,
		max_tokens: 3000,
	});
	const usage = completion.usage;
	const meta = usage
		? {
				model: completion.model,
				promptTokens: usage.prompt_tokens ?? 0,
				completionTokens: usage.completion_tokens ?? 0,
				totalTokens: usage.total_tokens ?? 0,
			}
		: null;

	const rawText = completion.choices[0].message?.content;
	if (!rawText) throw new Error("OpenAIからの応答が空です。");

	// biome-ignore lint/suspicious/noExplicitAny: AI出力の型補正のためany許容
	let parsed: any;
	try {
		parsed = JSON.parse(rawText);
	} catch (e) {
		console.warn("JSONパース失敗。rawText:", rawText);
		throw new Error("AI出力のJSONパースに失敗しました。");
	}

	/** ---- ロック集合 & 既存 status 用意 ---- */
	const { locked, statusMap } = buildLockedSetAndStatus(currentAssignments);
	const aiModified = parsed?.ai_modified as AiModifiedType;

	/** ---- 既存アサインを AI 出力へマージ（status 継承含む） ---- */
	if (aiModified) {
		parsed.ai_modified = mergeCurrentAssignments(
			parsed.ai_modified,
			currentAssignments,
		);
	}

	/** ---- サニタイズ（提出データを絶対制約として適用。ロックは落とさない） ---- */
	if (aiModified) {
		parsed.ai_modified = sanitizeAiModified(
			parsed.ai_modified,
			submissions,
			locked,
			{
				treatMissingAsUnavailable: false,
			},
		);
	}

	/** ---- 追い割当（count まで埋め切り。ロック/既存は保持） ---- */
	if (aiModified) {
		parsed.ai_modified = backfillToCount(
			parsed.ai_modified,
			templateShift,
			submissions,
			memberProfiles,
			locked,
		);
	}

	/** ---- absolute 可用者を空きに確実注入（満員の入替はしない） ---- */
	if (aiModified) {
		parsed.ai_modified = ensureAbsoluteAssigned(
			parsed.ai_modified,
			templateShift,
			submissions,
			memberProfiles,
			locked,
		);
	}

	/** ---- 最終正規化（pictureUrl/重複/カウント整合） ---- */
	if (aiModified) {
		parsed.ai_modified = normalizeAiModified(aiModified);
	}

	if (aiModified) {
		const { aiModified: hydrated } = hydrateAssignedFromProfiles(
			parsed.ai_modified,
			memberProfiles,
			{ dropUnknownUid: false },
		);
		parsed.ai_modified = hydrated;
	}

	/** ---- status を最終的に既存優先で再適用（保険） ---- */
	if (aiModified) {
		for (const [date, slots] of Object.entries(aiModified)) {
			for (const [range, slot] of Object.entries(slots)) {
				const key = `${date}::${range}`;
				const curStatus = statusMap.get(key);
				if (
					curStatus === "confirmed" ||
					curStatus === "draft" ||
					curStatus === "proposed"
				) {
					slot.status = curStatus;
				}
			}
		}
	}

	/** ---- updatedAt / updatedBy 付与 ---- */
	const now = new Date().toISOString();
	if (aiModified) {
		for (const [, slots] of Object.entries(parsed.ai_modified)) {
			for (const [, slot] of Object.entries(slots as AIShiftSlot[])) {
				slot.updatedAt = now;
				slot.updatedBy = "ai_adjustment";
			}
		}
	}

	return { ok: true, ...parsed, meta };
};
