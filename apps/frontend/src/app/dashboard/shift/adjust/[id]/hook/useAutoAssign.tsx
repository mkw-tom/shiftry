import type { AssignShiftDTO } from "@shared/api/shift/assign/dto";
import type {
	AssignUserType,
	ShiftsOfAssignType,
	SourceType,
} from "@shared/api/shift/assign/validations/put";
import type { ShiftRequestDTO } from "@shared/api/shift/request/dto";
import type {
	AbsoluteUserType,
	RequestPositionType,
} from "@shared/api/shift/request/validations/put";
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
	// absolute割当ロジック
	const assignAbsolute = (posReq: RequestPositionType): AssignUserType[] => {
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
	const assignPriority = (
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
						assignPos.vacancies = Math.max(
							0,
							assignPos.count - assigned.length,
						);
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
			setAssignShiftData(newAssignShiftData);
			setIsLoading(false);
		}, 1000);
	};

	return { autoAssignFunc, isLoading };
};
