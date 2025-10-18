/**
 * fillStrategies/ensureAbsoluteAssigned.ts
 * --------------------------------------------
 * 役割:
 *  - 枠に空きがある場合、雛形 absolute の可用者を確実に押し込む
 *  - 既に満員の場合は入替えを行わない（安全・非破壊）
 *
 * 注意:
 *  - absolute でも可用外なら追加しない
 */

import type { AiModifiedType } from "@shared/api/shift/ai/types/post-adjust.js";
import type {
	TemplateShiftInput,
	submissionsInput,
} from "@shared/api/shift/ai/validations/post-adjust.js";
import {
	applyCountIntegrity,
	normalizeAssignedList,
} from "../normalization.js";
import { buildSubmissionsIndex, isAvailable } from "../timeAndAvailability.js";

export function ensureAbsoluteAssigned(
	aiModified: AiModifiedType,
	templateShift: TemplateShiftInput,
	submissions: submissionsInput[],
	locked: Set<string>,
) {
	const subIdx = buildSubmissionsIndex(submissions);

	for (const [date, slots] of Object.entries(aiModified ?? {})) {
		const templateDay = templateShift.requests?.[date] ?? {};
		for (const [range, block] of Object.entries(slots ?? {})) {
			const absUsers = templateDay?.[range]?.absolute ?? [];
			if (!absUsers.length) continue;

			const count = Math.max(0, Number(block.count));
			const assigned = normalizeAssignedList(block.assigned);
			const already = new Set(assigned.map((a) => a.uid));

			for (const abs of absUsers) {
				const uid = abs?.id;
				if (!uid || already.has(uid)) continue;
				const available = isAvailable(subIdx, uid, date, range, true);
				if (!available) continue; // 可用外ならスキップ

				if (
					assigned.length < count &&
					!locked.has(`${date}::${range}::${uid}`)
				) {
					assigned.push({
						uid,
						displayName: abs?.name ?? uid,
						pictureUrl: "",
						confirmed: true,
					});
					already.add(uid);
				}
			}

			block.assigned = assigned;
			applyCountIntegrity(block);
		}
	}
	return aiModified;
}
