import type { ConstraintsInput } from "@shared/api/shift/adjust/validations/auto.js";

// "YYYY-MM-DD" 前提なら文字列比較でOK
export const shouldUseDate = (
	date: string,
	filter?: ConstraintsInput["dateFilter"],
) => {
	if (!filter || filter.mode === "ALL") return true;
	if (filter.mode === "SINGLE") return date === filter.date;
	if (filter.mode === "RANGE") {
		if (typeof filter.from === "string" && typeof filter.to === "string") {
			return filter.from <= date && date <= filter.to;
		}
		return false;
	}
	return true;
};
