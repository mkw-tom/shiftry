import type { ShiftsOfAssignType } from "@shared/api/common/types/json";
import type { shiftOfSubmittdWithUserId } from "@shared/api/shift/ai/validations/post-create";

export const findUsersBelowMin = (
	submittedShifts: shiftOfSubmittdWithUserId[],
	assignedShifts: ShiftsOfAssignType[],
	totalWeeks: number, // ← 週数を追加
): {
	userId: string;
	userName: string;
	assignedCount: number;
	requiredMin: number;
}[] => {
	const assignedMap = new Map(
		assignedShifts.map((a) => [a.userId, a.shifts.length]),
	);

	return submittedShifts
		.map((s) => {
			const assignedCount = assignedMap.get(s.userId) ?? 0;
			const requiredMin = s.weekCountMin * totalWeeks;
			return {
				userId: s.userId,
				userName: s.name,
				assignedCount,
				requiredMin,
			};
		})
		.filter((entry) => entry.assignedCount < entry.requiredMin);
};
