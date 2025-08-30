// import type { DayOfWeek } from "@shared/api/shift/ai/types/post-create.js";
// import type { SubmittedCalendarType } from "@shared/api/shift/submit/validations/put.js";
// import { generateDateWeekList } from "../../ai/create/utils/generateDateWeekList.js";

// export function convertToSubmittedCalender(
// 	startDate: string,
// 	endDate: string,
// 	availableWeeks: string[],
// 	specificDates: string[],
// ): SubmittedCalendarType {
// 	const calendar: SubmittedCalendarType = {};
// 	const dateWeekList = generateDateWeekList(startDate, endDate);

// 	const specificDateTimes = new Map<string, string>(); // date -> time
// 	const offDates = new Set<string>();

// 	for (const entry of specificDates) {
// 		if (entry.includes("&")) {
// 			const [date, time] = entry.split("&");
// 			specificDateTimes.set(date, time);
// 		} else {
// 			offDates.add(entry);
// 		}
// 	}

// 	const anytimeWeekdays = new Set<DayOfWeek>();
// 	const timeDefinedWeekdays = new Map<DayOfWeek, string>();

// 	for (const entry of availableWeeks) {
// 		if (entry.includes("&")) {
// 			const [weekday, time] = entry.split("&") as [DayOfWeek, string];
// 			timeDefinedWeekdays.set(weekday, time);
// 		} else {
// 			anytimeWeekdays.add(entry as DayOfWeek);
// 		}
// 	}

// 	for (const [date, weekday] of Object.entries(dateWeekList)) {
// 		if (specificDateTimes.has(date)) {
// 			calendar[date] = specificDateTimes.get(date) as string;
// 		} else if (offDates.has(date)) {
// 			calendar[date] = null;
// 		} else if (timeDefinedWeekdays.has(weekday)) {
// 			calendar[date] = timeDefinedWeekdays.get(weekday) as string;
// 		} else if (anytimeWeekdays.has(weekday)) {
// 			calendar[date] = "anytime.js";
// 		} else {
// 			calendar[date] = null;
// 		}
// 	}

// 	return calendar;
// }
