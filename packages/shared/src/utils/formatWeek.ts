export const convertDateToWeekByJapanese = (
	dayInput: string | Date,
	format: "short" | "middle" | "long",
): string => {
	const weekMap: Record<number, string> = {
		0: "日",
		1: "月",
		2: "火",
		3: "水",
		4: "木",
		5: "金",
		6: "土",
	};

	const date = typeof dayInput === "string" ? new Date(dayInput) : dayInput;
	const day = date.getDay(); // 0 (日) ~ 6 (土)

	if (format === "short") return weekMap[day] ?? "";
	if (format === "middle") return weekMap[day] ? `${weekMap[day]}曜` : "";
	if (format === "long") return weekMap[day] ? `${weekMap[day]}曜日` : "";

	return weekMap[day] ?? "";
};

type WeekdayKey =
	| "sunday"
	| "monday"
	| "tuesday"
	| "wednesday"
	| "thursday"
	| "friday"
	| "saturday";

export const convertDateToWeekByEnglish = (
	dayInput: string | Date,
): WeekdayKey => {
	const weekMap: Record<number, WeekdayKey> = {
		0: "sunday",
		1: "monday",
		2: "tuesday",
		3: "wednesday",
		4: "thursday",
		5: "friday",
		6: "saturday",
	};

	const date =
		typeof dayInput === "string"
			? new Date(`${dayInput}T09:00:00`) // JSTの深夜にしてズレ防止
			: dayInput;

	const day = date.getDay();
	return weekMap[day];
};

export const translateWeekToJapanese = (
	week: string,
	format: "short" | "middle" | "long",
): string => {
	const weekMap: Record<string, string> = {
		sunday: "日",
		monday: "月",
		tuesday: "火",
		wednesday: "水",
		thursday: "木",
		friday: "金",
		saturday: "土",
	};

	const base = weekMap[week.toLowerCase()];
	if (!base) return week; // 不正な値ならそのまま返す

	if (format === "short") return base;
	if (format === "middle") return `${base}曜`;
	if (format === "long") return `${base}曜日`;

	return base;
};
