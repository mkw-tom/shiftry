import { start } from "node:repl";
import type { ShiftsOfRequestsType } from "@shared/common/types/json";
import type { DayOfWeek, SlotInfo } from "../controller";

const getDatesOfDay = (
	day: string,
	startDate: string,
	endDate: string,
): string[] => {
	const result: string[] = [];
	const dayIndexMap: Record<DayOfWeek, number> = {
		Sunday: 0,
		Monday: 1,
		Tuesday: 2,
		Wednesday: 3,
		Thursday: 4,
		Friday: 5,
		Saturday: 6,
	};
	const targetDay = dayIndexMap[day as DayOfWeek];
	const current = new Date(startDate);
	const end = new Date(endDate);
	while (current <= end) {
		if (current.getDay() === targetDay) {
			result.push(current.toISOString().split("T")[0]);
		}
		current.setDate(current.getDate() + 1);
	}
	return result;
};

export const getUnassignedShift = (
	shiftRequest: ShiftsOfRequestsType,
	assignedShifts: {
		userId: string;
		shifts: { date: string; time: string }[];
	}[],
	startDate: string,
	endDate: string,
): SlotInfo[] => {
	const slotMap = new Map<string, { required: number; assigned: number }>();

	// startDate, endDate を使って day（曜日名）に該当する日付リストを返

	// ① defaultTimePositionsの展開
	for (const [day, slots] of Object.entries(
		shiftRequest.defaultTimePositions,
	)) {
		for (const slot of slots) {
			const [time, countStr] = slot.split("*");
			const count = Number.parseInt(countStr);
			const dates = getDatesOfDay(day, startDate, endDate); // ユーザー側でstartDate〜endDateを持っている前提
			for (const date of dates) {
				const key = `${date}&${time}`;
				slotMap.set(key, { required: count, assigned: 0 });
			}
		}
	}

	// ② overrideDatesの展開（上書き）
	for (const [date, slots] of Object.entries(shiftRequest.overrideDates)) {
		for (const slot of slots) {
			const [time, countStr] = slot.split("*");
			const count = Number.parseInt(countStr);
			const key = `${date}&${time}`;
			slotMap.set(key, { required: count, assigned: 0 });
		}
	}

	// ③ assignedShiftsに基づいて割り当てカウント
	for (const shift of assignedShifts) {
		for (const { date, time } of shift.shifts) {
			const key = `${date}&${time}`;
			const existing = slotMap.get(key);
			if (existing) {
				existing.assigned += 1;
			}
		}
	}

	// ④ 欠員があるポジションだけ抽出
	const unfilledSlots: SlotInfo[] = [];
	for (const [key, { required, assigned }] of slotMap.entries()) {
		if (assigned < required) {
			const [date, time] = key.split("&");
			unfilledSlots.push({ date, time, required, assigned });
		}
	}

	return unfilledSlots;
};
