// fillStrategies/ensureAbsoluteAssigned.ts
import { buildSubmissionsIndex, isAvailable } from "../timeAndAvailability.js";

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
import { buildDailyUsageMap } from "./dailyUsage.js";

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
	currentAssignments?: AiModifiedType, // ★ 追加
) {
	const { preferSwap = false } = opts;
	const subIdx = buildSubmissionsIndex(submissions);
	const dailyUsage = buildDailyUsageMap(aiModified, currentAssignments ?? {});

	for (const [date, slots] of Object.entries(aiModified ?? {})) {
		const templateDay = templateShift.requests?.[date] ?? {};
		const rangesToday = Object.keys(slots ?? {});

		for (const [range, block] of Object.entries(slots ?? {})) {
			const def = templateDay?.[range];
			const absUsers = def?.absolute ?? [];
			if (!absUsers.length) continue;

			const count = Math.max(0, Number(block.count));
			const assigned = normalizeAssignedList(block.assigned);

			// 既存 absolute セット
			const absSet = new Set(
				(absUsers ?? []).map((a) => a?.id).filter(Boolean) as string[],
			);

			for (const abs of absUsers) {
				const uid = abs?.id;
				if (!uid) continue;

				// 可用 & 日別未使用（or 非重複だけ許すなら重複チェックに置換）
				if (!isAvailable(subIdx, uid, date, range, true)) continue;
				if (dailyUsage.get(date)?.has(uid)) continue;

				const pic = getPictureUrlByUid(memberProfiles, uid);

				// 空きがあれば追加
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
					if (!dailyUsage.get(date)) dailyUsage.set(date, new Set());
					dailyUsage.get(date)?.add(uid);
					continue;
				}

				// 満員ならスワップ検討
				if (preferSwap) {
					const victimIdx = assigned.findIndex(
						(a) =>
							!locked.has(`${date}::${range}::${a.uid}`) && !absSet.has(a.uid),
					);
					if (victimIdx >= 0) {
						const victim = assigned[victimIdx];
						// ★ スワップ時も、absをその日に二重で使わない
						if (dailyUsage.get(date)?.has(uid)) continue;

						assigned.splice(victimIdx, 1, {
							uid,
							displayName: abs?.name ?? uid,
							pictureUrl: pic,
							confirmed: true,
							source: "absolute",
						});

						// ★ 日別使用マップの更新
						if (!dailyUsage.get(date)) dailyUsage.set(date, new Set());
						dailyUsage.get(date)?.add(uid);

						// victim の日別使用は外すべきか？ → ここでは同じ枠内のみ操作なので外さない（victimが他枠にも入ってる可能性を考慮）
					}
				}
			}

			block.assigned = assigned;
			applyCountIntegrity(block);
		}
	}
	return aiModified;
}
