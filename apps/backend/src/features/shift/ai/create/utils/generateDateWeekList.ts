import {
	type DateWeekListResponse,
	DayOfWeek,
} from "@shared/shift/ai/types/post-create";

export function generateDateWeekList(
	startDate: string,
	endDate: string,
): DateWeekListResponse {
	const result: DateWeekListResponse = {};
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
		const isoDate = current.toISOString().split("T")[0]; // YYYY-MM-DD
		const day = current.getDay(); // 0 = Sunday, 1 = Monday, ...
		result[isoDate] = dayNames[day] as DateWeekListResponse[string];
		current.setDate(current.getDate() + 1);
	}

	return result;
}
