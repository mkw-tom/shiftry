import type {
	ShiftsOfAssignType,
	ShiftsOfRequestsType,
} from "@shared/common/types/json";
import type { DayOfWeek } from "@shared/shift/ai/types/post-create";
import type { shiftOfSubmittdWithUserId } from "@shared/shift/ai/validations/post-create";

// ✅ 曜日リストを事前生成（date → DayOfWeek）
export function generateDateWeekList(
	startDate: string,
	endDate: string,
): Record<string, DayOfWeek> {
	const result: Record<string, DayOfWeek> = {};
	const dayNames = [
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
	] as const;

	const current = new Date(startDate);
	const end = new Date(endDate);

	while (current <= end) {
		const isoDate = current.toISOString().split("T")[0];
		const day = current.getDay();
		result[isoDate] = dayNames[day];
		current.setDate(current.getDate() + 1);
	}

	return result;
}

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
	const dateWeekList = generateDateWeekList(startDate, endDate);
	const slots: { [key: string]: { count: number; assigned: string[] } } = {};

	const overrideDateSet = new Set(Object.keys(shiftRequest.overrideDates));
	const start = new Date(startDate);
	const end = new Date(endDate);
	const totalWeeks = getWeeksBetween(start, end);

	// ① defaultTimePositions をスロット化（overrideDatesにない日）
	for (
		let date = new Date(start);
		date <= end;
		date.setDate(date.getDate() + 1)
	) {
		const dateStr = date.toISOString().split("T")[0];
		if (overrideDateSet.has(dateStr)) continue;

		const weekday = dateWeekList[dateStr];
		const defaultSlots = shiftRequest.defaultTimePositions[weekday] || [];

		for (const timeWithCount of defaultSlots) {
			const [time, countStr] = timeWithCount.split("*");
			const [startT, endT] = time.split("-");
			if (startT === endT) continue;

			const count = Number.parseInt(countStr);
			slots[`${dateStr}&${time}`] = { count, assigned: [] };
		}
	}

	// ② overrideDates を上書き
	for (const [date, timeArray] of Object.entries(shiftRequest.overrideDates)) {
		for (const timeWithCount of timeArray) {
			const [time, countStr] = timeWithCount.split("*");
			const [startT, endT] = time.split("-");
			if (startT === endT) continue;

			const count = Number.parseInt(countStr);
			slots[`${date}&${time}`] = { count, assigned: [] };
		}
	}

	// ③ 各ユーザーに対して割り当て
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

		// ❗ specificDates のうち、時間なし = 休み として除外
		const unavailableDateSet = new Set<string>(
			specificDates.filter((d) => !d.includes("&")).map((d) => d.split("&")[0]),
		);

		// ③-a availableWeeks を日付に展開（&timeあり or なし）
		for (const entry of availableWeeks) {
			if (entry.includes("&")) {
				const [day, time] = entry.split("&") as [DayOfWeek, string];
				for (const dateStr in dateWeekList) {
					if (
						dateWeekList[dateStr] === day &&
						!unavailableDateSet.has(dateStr)
					) {
						preferencesWithTime.push(`${dateStr}&${time}`);
					}
				}
			} else {
				preferencesWithoutTime.push(entry as DayOfWeek);
			}
		}

		// ③-b specificDates（時間ありのみ）
		for (const dateEntry of specificDates) {
			if (!dateEntry.includes("&")) continue; // 休み指定として無視
			const [dateStr, time] = dateEntry.split("&");
			const date = new Date(dateStr);
			if (date < start || date > end) continue;
			preferencesWithTime.push(`${dateStr}&${time}`);
		}

		// ③-c 時間指定ありを優先してアサイン
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
					(s) => s.date === date && s.time === time,
				);
				if (!alreadyAssigned) {
					slot.assigned.push(userId);
					assignedShifts.push({ date, time });
					count++;
				}
			}
		}

		// ③-d 曜日だけの希望で残り枠にアサイン
		for (const day of preferencesWithoutTime) {
			for (const dateStr in dateWeekList) {
				if (count >= maxShiftCount) break;
				if (unavailableDateSet.has(dateStr)) continue;
				if (dateWeekList[dateStr] !== day) continue;

				const defaultSlots = shiftRequest.defaultTimePositions[day] || [];
				for (const timeWithCount of defaultSlots) {
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
							(s) => s.date === dateStr && s.time === time,
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
