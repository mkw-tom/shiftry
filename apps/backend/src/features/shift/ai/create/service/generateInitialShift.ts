import type {
	ShiftsOfAssignType,
	ShiftsOfRequestsType,
} from "@shared/common/types/json";
import type { DayOfWeek } from "@shared/shift/ai/types/post-create";
import type { shiftOfSubmittdWithUserId } from "@shared/shift/ai/validations/post-create";

function getWeeksBetween(start: Date, end: Date): number {
	const diffTime = Math.abs(end.getTime() - start.getTime());
	return Math.ceil(diffTime / (7 * 24 * 60 * 60 * 1000));
}

export const generateInitialShift = (
	submittedShifts: shiftOfSubmittdWithUserId[],
	shiftRequest: ShiftsOfRequestsType,
	startDate: string,
	endDate: string,
): ShiftsOfAssignType[] => {
	const weekdayMap: Record<number, DayOfWeek> = {
		0: "Sunday",
		1: "Monday",
		2: "Tuesday",
		3: "Wednesday",
		4: "Thursday",
		5: "Friday",
		6: "Saturday",
	};

	const slots: { [key: string]: { count: number; assigned: string[] } } = {};

	const overrideDateSet = new Set(Object.keys(shiftRequest.overrideDates));
	const start = new Date(startDate);
	const end = new Date(endDate);
	const totalWeeks = getWeeksBetween(start, end);

	// ① defaultTimePositions → 日付化、overrideDatesと重複してたらスキップ
	for (
		let date = new Date(start);
		date <= end;
		date.setDate(date.getDate() + 1)
	) {
		const dateStr = date.toISOString().split("T")[0];
		if (overrideDateSet.has(dateStr)) continue;

		const weekday = weekdayMap[date.getDay()];
		const defaultSlots = shiftRequest.defaultTimePositions[weekday] || [];

		for (const timeWithCount of defaultSlots) {
			const [time, countStr] = timeWithCount.split("*");
			const [startT, endT] = time.split("-");
			if (startT === endT) continue;

			const count = Number.parseInt(countStr);
			slots[`${dateStr}&${time}`] = { count, assigned: [] };
		}
	}

	// ② overrideDates を優先して反映
	for (const [date, timeArray] of Object.entries(shiftRequest.overrideDates)) {
		for (const timeWithCount of timeArray) {
			const [time, countStr] = timeWithCount.split("*");
			const [startT, endT] = time.split("-");
			if (startT === endT) continue;

			const count = Number.parseInt(countStr);
			slots[`${date}&${time}`] = { count, assigned: [] };
		}
	}

	// ③ 各ユーザーに対して希望に基づいて割り当て
	const assignments: ShiftsOfAssignType[] = [];

	for (const submittedData of submittedShifts) {
		const {
			userId,
			name: userName,
			availableWeeks,
			specificDates,
			weekCountMax,
		} = submittedData;

		const preferencesWithTime: string[] = [];
		const preferencesWithoutTime: DayOfWeek[] = [];

		// specificDatesのうち、時間なし（完全休み）を除外リストに追加
		const unavailableDateSet = new Set<string>(
			specificDates.filter((d) => !d.includes("&")).map((d) => d.split("&")[0]),
		);

		// ③-a availableWeeks を分離
		for (const entry of availableWeeks) {
			if (entry.includes("&")) {
				const [day, time] = entry.split("&") as [DayOfWeek, string];
				for (
					let date = new Date(start);
					date <= end;
					date.setDate(date.getDate() + 1)
				) {
					const weekday = weekdayMap[date.getDay()];
					if (weekday === day) {
						const dateStr = date.toISOString().split("T")[0];
						if (unavailableDateSet.has(dateStr)) continue;
						preferencesWithTime.push(`${dateStr}&${time}`);
					}
				}
			} else {
				preferencesWithoutTime.push(entry as DayOfWeek);
			}
		}

		// ③-b specificDates（時間あり or default）
		for (const dateEntry of specificDates) {
			if (!dateEntry.includes("&")) continue; // 休み指定なので無視

			const [dateStr, time] = dateEntry.split("&");
			const date = new Date(dateStr);
			if (date < start || date > end) continue;
			preferencesWithTime.push(`${dateStr}&${time}`);
		}

		// ③-c 時間指定あり → 優先的に割り当て
		const assignedShifts: { date: string; time: string }[] = [];
		let count = 0;
		const maxShiftCount = weekCountMax * totalWeeks;

		for (const pref of preferencesWithTime) {
			if (count >= maxShiftCount) break;
			const slot = slots[pref];
			if (
				slot &&
				slot.assigned.length < slot.count &&
				!slot.assigned.includes(userId)
			) {
				const [date, time] = pref.split("&");
				if (unavailableDateSet.has(date)) continue;

				const alreadyAssigned = assignedShifts.some(
					(shift) => shift.date === date && shift.time === time,
				);
				if (!alreadyAssigned) {
					slot.assigned.push(userId);
					assignedShifts.push({ date, time });
					count++;
				}
			}
		}

		// ③-d 曜日のみ希望 → 残り枠にアサイン
		for (const day of preferencesWithoutTime) {
			for (
				let date = new Date(start);
				date <= end;
				date.setDate(date.getDate() + 1)
			) {
				if (count >= maxShiftCount) break;

				const weekday = weekdayMap[date.getDay()];
				if (weekday !== day) continue;

				const dateStr = date.toISOString().split("T")[0];
				if (unavailableDateSet.has(dateStr)) continue;

				const defaultTimes = shiftRequest.defaultTimePositions[weekday] || [];

				for (const timeWithCount of defaultTimes) {
					const [time] = timeWithCount.split("*");
					const [startT, endT] = time.split("-");
					if (startT === endT) continue;

					const key = `${dateStr}&${time}`;
					const slot = slots[key];

					if (
						slot &&
						slot.assigned.length < slot.count &&
						!slot.assigned.includes(userId)
					) {
						const alreadyAssigned = assignedShifts.some(
							(shift) => shift.date === dateStr && shift.time === time,
						);
						if (!alreadyAssigned) {
							slot.assigned.push(userId);
							assignedShifts.push({ date: dateStr, time });
							count++;
							break;
						}
					}
				}
			}
		}

		assignments.push({
			userId,
			userName,
			shifts: assignedShifts,
		});
	}

	return assignments;
};
