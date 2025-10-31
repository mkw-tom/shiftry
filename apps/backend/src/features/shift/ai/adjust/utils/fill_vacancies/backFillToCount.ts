import type { AiModifiedType } from "@shared/api/shift/ai/types/post-adjust.js";
import type {
	MemberProfileInput,
	SubmissionsInput,
	TemplateShiftInput,
} from "@shared/api/shift/ai/validations/post-adjust.js";
import { getPictureUrlByUid } from "../getMemberProfile.js";
import { buildHintIndex } from "../indexBuilders.js";
import {
	applyCountIntegrity,
	normalizeAssignedList,
} from "../normalization.js";
import { buildSubmissionsIndex, isAvailable } from "../timeAndAvailability.js";
import { buildDailyUsageMap } from "./dailyUsage.js";

export function backfillToCount(
	aiModified: AiModifiedType,
	templateShift: TemplateShiftInput,
	submissions: SubmissionsInput[],
	memberProfiles: MemberProfileInput[],
	locked: Set<string>,
	currentAssignments?: AiModifiedType, // ★ 追加（同日重複を避けるため）
) {
	const { index: hintIndex, nameIndex } = buildHintIndex(templateShift);
	const subIdx = buildSubmissionsIndex(submissions);
	const allUserIds = submissions.map((s) => s.userId);

	// ★ 同日使用状況を集約
	const dailyUsage = buildDailyUsageMap(aiModified, currentAssignments ?? {});

	for (const [date, slots] of Object.entries(aiModified ?? {})) {
		for (const [range, block] of Object.entries(slots ?? {})) {
			const count = Math.max(0, Number(block.count ?? 0));
			const assigned = normalizeAssignedList(block.assigned);
			const alreadyThisSlot = new Set(assigned.map((a) => a.uid));
			if (assigned.length >= count) {
				block.assigned = assigned;
				applyCountIntegrity(block);
				continue;
			}

			// ★ その日の既存枠の時間帯リスト（重なりチェック用）
			const todays = aiModified?.[date] ?? {};
			const rangesToday = Object.keys(todays);

			const hint = hintIndex.get(date)?.get(range);
			const candidates = allUserIds
				// 同スロット重複なし
				.filter((uid) => !alreadyThisSlot.has(uid))
				// 提出可用
				.filter((uid) => isAvailable(subIdx, uid, date, range, true))
				// ★ 同日すでに他枠に入っていない（重なり問わず完全NG）にしたいならココだけで弾く
				.filter((uid) => !dailyUsage.get(date)?.has(uid))
				// もし「時間重なりのみ不可（非重なりなら同日複数可）」にしたい場合は↑を外して↓で弾く
				// .filter((uid) => {
				//   const set = todays;
				//   for (const [r2, b2] of Object.entries(set)) {
				//     if (b2?.assigned?.some((a) => a.uid === uid) && isOverlapping(range, r2)) {
				//       return false;
				//     }
				//   }
				//   return true;
				// })
				.map((uid) => {
					const inAbs = hint?.abs?.has(uid) ?? false;
					const priLevel = hint?.pri?.get(uid) ?? 999;
					const score = inAbs ? -1 : priLevel;
					return { uid, inAbs, priLevel, score };
				})
				.sort((a, b) => a.score - b.score || (a.uid < b.uid ? -1 : 1));

			for (const c of candidates) {
				if (assigned.length >= count) break;
				if (locked.has(`${date}::${range}::${c.uid}`)) continue;

				let source: "absolute" | "priority" | "manual" = "manual";
				if (c.inAbs) source = "absolute";
				else if (c.priLevel !== 999) source = "priority";

				const pic = getPictureUrlByUid(memberProfiles, c.uid);

				// ★ 追加直前にも最終確認（別スロットで直前に入った可能性）
				if (dailyUsage.get(date)?.has(c.uid)) continue;

				assigned.push({
					uid: c.uid,
					displayName: nameIndex.get(c.uid) ?? c.uid,
					pictureUrl: pic,
					confirmed: true,
					source,
				});

				alreadyThisSlot.add(c.uid);
				// ★ 日別使用マップを更新
				if (!dailyUsage.get(date)) dailyUsage.set(date, new Set());
				dailyUsage.get(date)?.add(c.uid);
			}

			block.assigned = assigned;
			applyCountIntegrity(block);
		}
	}
	return aiModified;
}
