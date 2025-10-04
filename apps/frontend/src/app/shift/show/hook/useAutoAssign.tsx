import type { AssignShiftDTO } from "@shared/api/shift/assign/dto";
import type {
	AssignUserType,
	SourceType,
} from "@shared/api/shift/assign/validations/put";
import type { ShiftRequestDTO } from "@shared/api/shift/request/dto";
import type React from "react";
import { FC, useState } from "react";

export const useAutoAssign = ({
	assignShiftData,
	shiftRequestData,
	setAssignShiftData,
}: {
	assignShiftData: AssignShiftDTO;
	shiftRequestData: ShiftRequestDTO;
	setAssignShiftData: React.Dispatch<React.SetStateAction<AssignShiftDTO>>;
}) => {
	const [isLoading, setIsLoading] = useState(false);

	// period: { type: 'all' | 'range' | 'single', start?: string, end?: string, date?: string }
	const autoAssignFunc = (
		checkedFields: string[],
		period?: {
			type: "all" | "range" | "single";
			start?: string;
			end?: string;
			date?: string;
		},
	) => {
		setIsLoading(true);
		setTimeout(() => {
			const newAssignShiftData = JSON.parse(JSON.stringify(assignShiftData));
			Object.entries(shiftRequestData.requests).map(([date, positions]) => {
				if (!positions) return;
				// 期間フィルタ
				let dateCheck = true;
				if (period?.type === "range" && period.start && period.end) {
					dateCheck = date >= period.start && date <= period.end;
				} else if (period?.type === "single" && period.date) {
					dateCheck = date === period.date;
				}
				if (!dateCheck) return;
				Object.entries(positions).map(([time, posReq]) => {
					if (!posReq) return;
					const assignPos = newAssignShiftData.shifts?.[date]?.[time];
					if (!assignPos) return;
					let assigned: AssignUserType[] = [];
					if (
						checkedFields.includes("absolute") &&
						Array.isArray(posReq.absolute)
					) {
						assigned = [
							...assigned,
							...posReq.absolute.map((user) => ({
								uid: user.id,
								displayName: user.name,
								pictureUrl: user.pictureUrl,
								source: "absolute" as SourceType,
								confirmed: true,
							})),
						];
					}
					if (
						checkedFields.includes("priority") &&
						Array.isArray(posReq.priority)
					) {
						assigned = [
							...assigned,
							...posReq.priority.map((user) => ({
								uid: user.id,
								displayName: user.name,
								pictureUrl: user.pictureUrl,
								source: "priority" as SourceType,
								confirmed: false,
							})),
						];
					}
					// uidで重複除去
					assigned = assigned.filter(
						(a, i, arr) => arr.findIndex((b) => b.uid === a.uid) === i,
					);
					assignPos.assigned = assigned;
					assignPos.assignedCount = assigned.length;
					assignPos.vacancies = Math.max(0, assignPos.count - assigned.length);
				});
			});
			setAssignShiftData(newAssignShiftData);
			setIsLoading(false);
		}, 1000);
	};

	return { autoAssignFunc, isLoading };
};
