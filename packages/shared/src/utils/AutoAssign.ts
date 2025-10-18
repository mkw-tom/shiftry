import type { AssignShiftDTO } from "../api/shift/assign/dto.js";
import type {
	AssignUserType,
	SourceType,
} from "../api/shift/assign/validations/put.js";
import type { ShiftRequestDTO } from "../api/shift/request/dto.js";
import type {
	AbsoluteUserType,
	RequestPositionType,
} from "../api/shift/request/validations/put.js";

export type AutoAssignPeriod = {
	type: "all" | "range" | "single";
	start?: string;
	end?: string;
	date?: string;
};

// absolute割当ロジック
export const assignAbsolute = (
	posReq: RequestPositionType,
): AssignUserType[] => {
	if (!Array.isArray(posReq.absolute)) return [];
	return posReq.absolute.map((user: AbsoluteUserType) => ({
		uid: user.id,
		displayName: user.name,
		pictureUrl: user.pictureUrl,
		source: "absolute" as SourceType,
		confirmed: true,
	}));
};

// priority割当ロジック
export const assignPriority = (
	posReq: RequestPositionType,
	remain: number,
): AssignUserType[] => {
	if (!Array.isArray(posReq.priority)) return [];
	const sortedPriority = [...posReq.priority].sort((a, b) => {
		if (a.level === undefined && b.level === undefined) return 0;
		if (a.level === undefined) return 1;
		if (b.level === undefined) return -1;
		return b.level - a.level;
	});
	const result: AssignUserType[] = [];
	for (let i = 0; i < remain; i++) {
		const user = sortedPriority[i];
		if (!user) break;
		result.push({
			uid: user.id,
			displayName: user.name,
			pictureUrl: user.pictureUrl,
			source: "priority" as SourceType,
			confirmed: false,
		});
	}
	return result;
};

/**
 * シフト自動割当ロジック（フロント・バックエンド共通利用可能）
 * @param assignShiftData 割当先データ
 * @param shiftRequestData 希望データ
 * @param checkedFields ["absolute", "priority"] など
 * @param period 期間指定
 * @returns 割当済みAssignShiftDTO
 */
export function autoAssign(
	assignShiftData: AssignShiftDTO,
	shiftRequestData: ShiftRequestDTO,
	checkedFields: string[],
	period?: AutoAssignPeriod,
): AssignShiftDTO {
	const newAssignShiftData = JSON.parse(JSON.stringify(assignShiftData));
	Object.entries(shiftRequestData.requests).map(([date, positions]) => {
		if (!positions) return;

		let dateCheck = true;
		if (period?.type === "range" && period.start && period.end) {
			dateCheck = date >= period.start && date <= period.end;
		} else if (period?.type === "single" && period.date) {
			dateCheck = date === period.date;
		}
		if (!dateCheck) return;

		Object.entries(positions).map(([time, posReq]) => {
			let assigned: AssignUserType[] = [];
			if (!posReq) return;
			const assignPos = newAssignShiftData.shifts?.[date]?.[time];
			if (!assignPos) return;
			if (checkedFields.includes("absolute")) {
				assigned = [...assigned, ...assignAbsolute(posReq)];
			}
			if (posReq.count === assigned.length) {
				assignPos.assigned = assigned;
				assignPos.assignedCount = assigned.length;
				assignPos.vacancies = Math.max(0, assignPos.count - assigned.length);
				return;
			}
			if (checkedFields.includes("priority")) {
				assigned = [
					...assigned,
					...assignPriority(posReq, posReq.count - assigned.length),
				];
			}
			assigned = assigned.filter(
				(a, i, arr) => arr.findIndex((b) => b.uid === a.uid) === i,
			);
			assignPos.assigned = assigned;
			assignPos.assignedCount = assigned.length;
			assignPos.vacancies = Math.max(0, assignPos.count - assigned.length);
		});
	});
	return newAssignShiftData;
}
