import type { RequestsType } from "@shared/api/common/types/json.js";
import type { DayOfWeek } from "@shared/api/shift/ai/types/post-create.js";
import { generateDateWeekList } from "../../ai/create/utils/generateDateWeekList.js";

export function convertToRequestCalendar(
	startDate: string,
	endDate: string,
	defaultTimePositions: Record<DayOfWeek, string[]>,
	overrideDates: Record<string, string[]>,
): RequestsType {
	const calendar: RequestsType = {};
	const dateWeekMap = generateDateWeekList(startDate, endDate);

	for (const [date, weekday] of Object.entries(dateWeekMap)) {
		if (overrideDates[date]) {
			if (overrideDates[date].length === 0) {
				calendar[date] = null; // 定休日
			} else {
				calendar[date] = {};
				for (const timeWithCount of overrideDates[date]) {
					const [time, countStr] = timeWithCount.split("*");
					calendar[date][time] = {
						name: time,
						jobRoles: [],
						count: Number.parseInt(countStr),
						absolute: [],
						priority: [],
					};
				}
			}
		} else {
			const defaultSlots = defaultTimePositions[weekday] || [];
			if (defaultSlots.length === 0) {
				calendar[date] = null;
			} else {
				calendar[date] = {};
				for (const timeWithCount of defaultSlots) {
					const [time, countStr] = timeWithCount.split("*");
					calendar[date][time] = {
						name: time,
						count: Number.parseInt(countStr),
						absolute: [],
						priority: [],
						jobRoles: [],
					};
				}
			}
		}
	}

	return calendar;
}
