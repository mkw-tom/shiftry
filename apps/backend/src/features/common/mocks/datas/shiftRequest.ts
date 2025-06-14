import { faker } from "@faker-js/faker";
import type { $Enums } from "@prisma/client";

export const mockRequests = {
	defaultTimePositions: {
		Monday: ["09:00-13:00"],
		Tuesday: ["10:00-14:00"],
		Wednesday: [],
		Thursday: [],
		Friday: [],
		Saturday: [],
		Sunday: [],
	},
	overrideDates: {
		"2025-04-10": ["08:00-12:00"],
		"2025-04-14": [],
	},
};

// モックデータ本体
export const mockShiftRequest = (status: $Enums.RequestStatus) => ({
	id: faker.string.uuid(),
	createdAt: new Date(),
	updatedAt: new Date(),
	storeId: faker.string.uuid(),
	weekStart: faker.date.future(), // 例：来週スタート
	weekEnd: faker.date.future({ refDate: new Date(), years: 1 }),
	requests: mockRequests,
	status: status,
	deadline: faker.datatype.boolean() ? faker.date.soon() : null,
});
