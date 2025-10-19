/**
 * fillStrategies/backfillToCount.ts
 * --------------------------------------------
 * 役割:
 *  - 枠の不足分を「提出可用」を前提に、absolute/priority を優先して count まで埋める
 *  - 既存ロックはそのまま保持
 *
 * 優先順:
 *  1) absolute に載っている可用者
 *  2) priority.level 昇順の可用者
 *  3) その他（uid 昇順）
 */

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

export function backfillToCount(
	aiModified: AiModifiedType,
	templateShift: TemplateShiftInput,
	submissions: SubmissionsInput[],
	memberProfiles: MemberProfileInput[],
	locked: Set<string>,
) {
	const { index: hintIndex, nameIndex } = buildHintIndex(templateShift);
	const subIdx = buildSubmissionsIndex(submissions);
	const allUserIds = submissions.map((s) => s.userId);

	for (const [date, slots] of Object.entries(aiModified ?? {})) {
		for (const [range, block] of Object.entries(slots ?? {})) {
			const count = Math.max(0, Number(block.count ?? 0));
			const assigned = normalizeAssignedList(block.assigned);
			const already = new Set(assigned.map((a) => a.uid));
			if (assigned.length >= count) {
				block.assigned = assigned;
				applyCountIntegrity(block);
				continue;
			}

			const hint = hintIndex.get(date)?.get(range);
			const candidates = allUserIds
				.filter((uid) => !already.has(uid))
				.filter((uid) => isAvailable(subIdx, uid, date, range, true))
				.map((uid) => {
					const inAbs = hint?.abs?.has(uid) ?? false;
					const priLevel = hint?.pri?.get(uid) ?? 999;
					const score = inAbs ? -1 : priLevel; // absolute 最優先(-1) → priority.level → その他
					return { uid, inAbs, priLevel, score };
				})
				.sort(
					(a, b) =>
						a.score - b.score || (a.uid < b.uid ? -1 : a.uid > b.uid ? 1 : 0),
				);

			for (const c of candidates) {
				if (assigned.length >= count) break;
				if (locked.has(`${date}::${range}::${c.uid}`)) continue; // 念のため
				let source: "absolute" | "priority" | "manual" = "manual";
				if (c.inAbs) {
					source = "absolute";
				} else if (c.priLevel !== 999) {
					source = "priority";
				}

				const pic = getPictureUrlByUid(memberProfiles, c.uid);
				assigned.push({
					uid: c.uid,
					displayName: nameIndex.get(c.uid) ?? c.uid,
					pictureUrl: pic,
					confirmed: true,
					source,
				});
				already.add(c.uid);
			}

			block.assigned = assigned;
			applyCountIntegrity(block);
		}
	}
	return aiModified;
}
