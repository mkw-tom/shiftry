export const YMDHM = (date: Date): string => {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	const hours = String(date.getHours()).padStart(2, "0");
	const minutes = String(date.getMinutes()).padStart(2, "0");

	return `${year}/${month}/${day} ${hours}:${minutes}`;
};

export const YMDW = (date: Date): string => {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	const dayOfWeek = date.getDay();
	const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
	const weekday = weekdays[dayOfWeek];

	return `${year}/${month}/${day}（${weekday}）`;
};

export const MDW = (date: Date): string => {
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	const dayOfWeek = date.getDay();
	const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
	const weekday = weekdays[dayOfWeek];

	return `${month}/${day}（${weekday}）`;
};
