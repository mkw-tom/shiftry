import type {
	AIShiftAdjustResponse,
	AIShiftSlot,
	AiModifiedType,
} from "@shared/api/shift/ai/types/post-adjust.js";
import type {
	ConstraintsInput,
	CurrentAssignmentsInput,
	TemplateShiftInput,
	submissionsInput,
} from "@shared/api/shift/ai/validations/post-adjust.js";
import openai from "../../../../config/openai.js";
import {
	backfillToCount,
	buildLockedSetAndStatus,
	ensureAbsoluteAssigned,
	mergeCurrentAssignments,
	normalizeAiModified,
	sanitizeAiModified,
} from "./utils/index.js";

export const getAIShiftAdjustment = async ({
	templateShift,
	submissions,
	currentAssignments,
	constraints,
}: {
	templateShift: TemplateShiftInput;
	submissions: submissionsInput[];
	currentAssignments: CurrentAssignmentsInput;
	constraints?: ConstraintsInput;
}): Promise<AIShiftAdjustResponse> => {
	/** ---- システムプロンプト ---- */
	const systemPrompt = `
あなたは小規模店舗向けのシフト調整AIです。
出力は必ず純粋なJSONのみ。キーはすべてダブルクオート、コメント・末尾カンマ禁止。

[目的]
- 現状の割当(currentAssignments)は変更せず、空き枠や不足分のみを「提出データ(可用時間)を最優先」に補完する。
- 各枠で可能な限り count に到達するよう最大限埋める（候補が尽きた場合だけ vacancies を残す）。
- 雛形(absolute/priority)は参考情報。提出データに反する場合は採用しない。

[候補抽出の定義]
- 可用一致の判定:
  - "anytime" は当該日の全ての時間帯に一致。
  - "HH:mm-HH:mm" は枠時間と重なっていれば一致（部分一致で可）。
- 可用外は除外。提出データが無い(未提出)場合は不可とみなす。

[選定の順序（提出で可用一致する候補間の優先）]
1) absolute に載っているユーザー
2) priority に載っているユーザー（priority.level 昇順）
3) 上記以外（ユーザーID昇順）
※ いずれも「提出データで可用一致」が前提

[厳守ルール]
- 提出データ > currentAssignments > absolute/priority の優先順位で考慮。
- 既存の currentAssignments は再配置・削除しない（維持）。status も変更しない。
- "assigned.length" は "count" を超えない。重複ユーザー不可。
- "assignedCount" は "assigned.length" と一致。
- "vacancies" は "count - assigned.length"（下限0）。
- "confirmed": 提出データで可用一致して割当てた場合のみ true を使用（false は出力しない）。
- "updatedAt" と "updatedBy" は AI が生成しない（サーバで付与）。

[充足アルゴリズム]
- 各枠について、現状の assigned を維持しつつ、上記の優先順に候補を追加し、count に達するまで埋める。
- 候補が完全に尽きたときのみ vacancies を残す。

[出力形式]
{
  "ai_modified": {
    "YYYY-MM-DD": {
      "HH:mm-HH:mm": {
        "name": "枠名",
        "count": 2,
        "jobRoles": ["任意"],
        "assigned": [
          { "uid": "user_001", "displayName": "氏名", "pictureUrl": "URL", "confirmed": true }
        ],
        "assignedCount": 1,
        "vacancies": 1,
        "status": "proposed"
      }
    }
  }
}
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
				treatMissingAsUnavailable: true,
			},
		);
	}

	/** ---- 追い割当（count まで埋め切り。ロック/既存は保持） ---- */
	if (aiModified) {
		parsed.ai_modified = backfillToCount(
			parsed.ai_modified,
			templateShift,
			submissions,
			locked,
		);
	}

	/** ---- absolute 可用者を空きに確実注入（満員の入替はしない） ---- */
	if (aiModified) {
		parsed.ai_modified = ensureAbsoluteAssigned(
			parsed.ai_modified,
			templateShift,
			submissions,
			locked,
		);
	}

	/** ---- 最終正規化（pictureUrl/重複/カウント整合） ---- */
	if (aiModified) {
		parsed.ai_modified = normalizeAiModified(aiModified);
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
