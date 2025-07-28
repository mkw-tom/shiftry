import type {
	ShiftsOfAssignType,
	ShiftsOfRequestsType,
} from "@shared/api/common/types/json";
import type { DayOfWeek } from "@shared/api/shift/ai/types/post-create";
import type { shiftOfSubmittdWithUserId } from "@shared/api/shift/ai/validations/post-create";

// 📆 曜日リストを事前生成（date → DayOfWeek）
function generateDateWeekList(
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
	const start = new Date(startDate);
	const end = new Date(endDate);
	const totalWeeks = getWeeksBetween(start, end);

	// ① shiftテンプレートスロットを作る
	const slots: { [key: string]: { count: number; assigned: string[] } } = {};

	const overrideDateSet = new Set(Object.keys(shiftRequest.overrideDates));

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

			slots[`${dateStr}&${time}`] = {
				count: Number.parseInt(countStr),
				assigned: [],
			};
		}
	}

	for (const [date, timeArray] of Object.entries(shiftRequest.overrideDates)) {
		for (const timeWithCount of timeArray) {
			const [time, countStr] = timeWithCount.split("*");
			const [startT, endT] = time.split("-");
			if (startT === endT) continue;

			slots[`${date}&${time}`] = {
				count: Number.parseInt(countStr),
				assigned: [],
			};
		}
	}

	// ② 各ユーザーの希望に基づいてアサイン
	const assignments: ShiftsOfAssignType[] = [];

	for (const user of submittedShifts) {
		const {
			userId,
			name: userName,
			specificDates,
			availableWeeks,
			weekCountMax,
		} = user;

		const maxShiftCount = weekCountMax * totalWeeks;
		let count = 0;
		const assignedShifts: { date: string; time: string }[] = [];

		const unavailableDates = new Set(
			specificDates.filter((d) => !d.includes("&")).map((d) => d.split("&")[0]),
		);

		const specificDateTimeSet = new Set(
			specificDates.filter((d) => d.includes("&")), // 出勤可能時間のみ
		);

		// ③ specificDates（時間あり）優先アサイン
		for (const entry of specificDateTimeSet) {
			if (count >= maxShiftCount) break;

			const [date, time] = entry.split("&");
			const key = `${date}&${time}`;
			const slot = slots[key];

			if (
				slot &&
				slot.assigned.length < slot.count &&
				!slot.assigned.includes(userId)
			) {
				slot.assigned.push(userId);
				assignedShifts.push({ date, time });
				count++;
			}
		}

		// ④ availableWeeks（時間あり）を展開して追加
		for (const entry of availableWeeks) {
			if (!entry.includes("&")) continue;

			const [day, time] = entry.split("&") as [DayOfWeek, string];
			for (const dateStr in dateWeekList) {
				if (
					count >= maxShiftCount ||
					unavailableDates.has(dateStr) ||
					specificDateTimeSet.has(`${dateStr}&${time}`)
				)
					continue;

				if (dateWeekList[dateStr] !== day) continue;

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
					}
				}
			}
		}

		// ⑤ availableWeeks（時間なし）で残り枠を埋める
		const noTimeDays = availableWeeks.filter(
			(e) => !e.includes("&"),
		) as DayOfWeek[];

		for (const dateStr in dateWeekList) {
			if (count >= maxShiftCount || unavailableDates.has(dateStr)) continue;

			const weekday = dateWeekList[dateStr];
			if (!noTimeDays.includes(weekday)) continue;

			const defaultSlots = shiftRequest.defaultTimePositions[weekday] || [];

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

		assignments.push({
			userId,
			userName,
			shifts: assignedShifts,
			jobRoles: [],
		});
	}

	return assignments;
};
