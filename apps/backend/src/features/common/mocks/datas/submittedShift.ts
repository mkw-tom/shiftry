import type { shiftsOfSubmittedType } from "@shared/api/common/types/json";

export const mockShiftsOfSubmitted: shiftsOfSubmittedType = {
	name: "テスト人間",
	weekCountMin: 2,
	weekCountMax: 3,
	availableWeeks: ["Monday&10:00-17:00", "Wednesday", "Friday&10:00-17:00"],
	specificDates: [
		"2025-11-10&14:00-18:00", // この日は午後のみOK
		"2025-11-12", // この日は完全休み
		"2025-11-14&-15:00", // 15時までOK（午後は不可）
	],
};
