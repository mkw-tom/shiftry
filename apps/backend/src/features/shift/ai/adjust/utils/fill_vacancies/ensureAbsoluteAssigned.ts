/**
 * fillStrategies/ensureAbsoluteAssigned.ts
 * --------------------------------------------
 * 役割:
 *  - 枠に空きがある場合、雛形 absolute の可用者を確実に押し込む
 *  - preferSwap=true の場合は満員でも「ロックされていない・absoluteでない」割当と入替可
 *
 * 注意:
 *  - absolute でも可用外なら追加しない
 *  - ロック(locked)は絶対に外さない
 */

import type { AiModifiedType } from "@shared/api/shift/ai/types/post-adjust.js";
import type {
	MemberProfileInput,
	SubmissionsInput,
	TemplateShiftInput,
} from "@shared/api/shift/ai/validations/post-adjust.js";
import { getPictureUrlByUid } from "../getMemberProfile.js";
import {
	applyCountIntegrity,
	normalizeAssignedList,
} from "../normalization.js";
import { buildSubmissionsIndex, isAvailable } from "../timeAndAvailability.js";

type EnsureAbsoluteOptions = {
	/** 満員でもスワップして absolute を最優先で入れる（ロック/absolute 以外と入替） */
	preferSwap?: boolean;
};

export function ensureAbsoluteAssigned(
	aiModified: AiModifiedType,
	templateShift: TemplateShiftInput,
	submissions: SubmissionsInput[],
	memberProfiles: MemberProfileInput[],
	locked: Set<string>,
	opts: EnsureAbsoluteOptions = {},
) {
	const { preferSwap = false } = opts;
	const subIdx = buildSubmissionsIndex(submissions);

	for (const [date, slots] of Object.entries(aiModified ?? {})) {
		const templateDay = templateShift.requests?.[date] ?? {};
		for (const [range, block] of Object.entries(slots ?? {})) {
			const def = templateDay?.[range];
			const absUsers = def?.absolute ?? [];
			if (!absUsers.length) continue;

			// priority の level を参照するためのマップ（なければ 999）
			const priLevelMap = new Map<string, number>();
			for (const p of def?.priority ?? []) {
				if (p?.id) priLevelMap.set(p.id, Number(p.level ?? 999));
			}
			const absSet = new Set(
				(absUsers ?? []).map((a) => a?.id).filter(Boolean) as string[],
			);

			const count = Math.max(0, Number(block.count));
			const assigned = normalizeAssignedList(block.assigned);
			const already = new Set(assigned.map((a) => a.uid));

			for (const abs of absUsers) {
				const uid = abs?.id;
				const pic = getPictureUrlByUid(memberProfiles, uid);

				if (!uid || already.has(uid)) continue;

				// 可用チェック
				if (!isAvailable(subIdx, uid, date, range, true)) continue;

				// 1) 空きがあればそのまま追加（従来どおりの非破壊）
				if (
					assigned.length < count &&
					!locked.has(`${date}::${range}::${uid}`)
				) {
					assigned.push({
						uid,
						displayName: abs?.name ?? uid,
						pictureUrl: pic,
						confirmed: true,
						source: "absolute",
					});
					already.add(uid);
					continue;
				}

				// 2) 満員 & preferSwap=true の場合のみ、スワップを検討
				if (preferSwap) {
					// 交換候補のスコア: absolute でない & ロックされていない人だけ
					// スコアは「priority.level が大きいほど落としやすい」「priority 非該当は 999」
					// 同点は uid 昇順
					const victimIdx = assigned
						.map((a, i) => ({ a, i }))
						.filter(({ a }) => !locked.has(`${date}::${range}::${a.uid}`)) // ロック不可
						.filter(({ a }) => !absSet.has(a.uid)) // absolute 既存は落とさない
						.map(({ a, i }) => ({
							i,
							uid: a.uid,
							level: priLevelMap.get(a.uid) ?? 999,
						}))
						.sort((x, y) => y.level - x.level || (x.uid < y.uid ? -1 : 1)) // level 大→小で並べ替え（落としやすい順）
						.map((v) => v.i)[0]; // 最も落としやすい1人

					if (typeof victimIdx === "number") {
						// スワップ実施
						assigned.splice(victimIdx, 1, {
							uid,
							displayName: abs?.name ?? uid,
							pictureUrl: pic,
							confirmed: true,
							source: "absolute",
						});
						already.add(uid);
						// 1人入れられたら次の absolute へ（複数入れたい場合は続行でもOK）
					}
				}
			}

			block.assigned = assigned;
			applyCountIntegrity(block);
		}
	}
	return aiModified;
}
