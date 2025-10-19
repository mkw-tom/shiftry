/**
 * mergeAndSanitize.ts
 * --------------------------------------------
 * 役割:
 *  - 既存アサイン(currentAssignments)を AI 出力へマージ（既存優先）
 *  - 提出可用性を絶対制約として適用（ただし既存ロックは保持）
 *
 * 期待効果:
 *  - 既存確定を壊さない保証
 *  - AIの出力が多少ズレていても安全化
 */

import type { AiModifiedType } from "@shared/api/shift/ai/types/post-adjust.js";
import type {
	CurrentAssignmentsInput,
	SubmissionsInput,
} from "@shared/api/shift/ai/validations/post-adjust.js";
import type { AssignStatusType } from "@shared/api/shift/assign/validations/put.js";
import { applyCountIntegrity, normalizeAssignedList } from "./normalization.js";
import { buildSubmissionsIndex, isAvailable } from "./timeAndAvailability.js";

/**
 * 既存アサインを AI 出力へ注入し、status も継承する
 * - 既存を先頭に結合 → count超過時は後尾カット（既存を守る）
 */
export function mergeCurrentAssignments(
	aiModified: AiModifiedType,
	currentAssignments: CurrentAssignmentsInput,
) {
	for (const [date, slots] of Object.entries(currentAssignments)) {
		for (const [range, cur] of Object.entries(slots)) {
			if (!aiModified[date]) aiModified[date] = {};
			if (!aiModified[date][range]) {
				aiModified[date][range] = {
					name: cur?.name,
					count: cur?.count,
					jobRoles: cur?.jobRoles ?? [],
					assigned: [],
					status: cur?.status ?? ("proposed" as AssignStatusType),
					assignedCount: cur?.assignedCount ?? 0,
					vacancies: cur?.vacancies ?? 0,
					updatedAt: cur?.updatedAt ?? "",
					updatedBy: cur?.updatedBy ?? "",
				};
			}
			const out = aiModified[date][range];
			if (cur?.assigned == null) return;
			const curAssigned = normalizeAssignedList(
				(cur?.assigned ?? []).map((a) => ({
					...a,
					pictureUrl: a.pictureUrl,
				})),
			);

			out.assigned = normalizeAssignedList([
				...curAssigned, // 既存を先頭に
				...(Array.isArray(out.assigned) ? out.assigned : []),
			]);

			// count/assignedCount/vacancies 整合（既存を守るため超過時は後方を落とす）
			out.count = Math.max(0, Number(out.count ?? cur?.count ?? 0));
			applyCountIntegrity(out);

			// status は既存優先で継承
			if (cur?.status) out.status = cur.status;
		}
	}
	return aiModified;
}

/**
 * 提出可用制約でAI出力をフィルタ
 * - ロックされた既存割当は必ず残す
 * - それ以外は isAvailable で判定
 * - confirmed はロック保持→元値のまま／新規→true
 */
export function sanitizeAiModified(
	aiModified: AiModifiedType,
	submissions: SubmissionsInput[],
	locked: Set<string>,
	opts?: { treatMissingAsUnavailable?: boolean },
) {
	const index = buildSubmissionsIndex(submissions);
	const treatMissing = opts?.treatMissingAsUnavailable ?? true;

	for (const [date, slots] of Object.entries(aiModified)) {
		for (const [range, block] of Object.entries(slots)) {
			const assigned = normalizeAssignedList(block.assigned);
			const count = Math.max(0, Number(block.count));
			const seen = new Set<string>();

			const valid = assigned
				.filter((a) => {
					const isLocked = locked.has(`${date}::${range}::${a.uid}`);
					return (
						isLocked || isAvailable(index, a.uid, date, range, treatMissing)
					);
				})
				.filter((a) => {
					if (seen.has(a.uid)) return false;
					seen.add(a.uid);
					return true;
				})
				.slice(0, count)
				.map((a) => {
					const isLocked = locked.has(`${date}::${range}::${a.uid}`);
					return { ...a, confirmed: isLocked ? Boolean(a.confirmed) : true };
				});

			block.assigned = valid;
			applyCountIntegrity(block);
		}
	}
	return aiModified;
}
