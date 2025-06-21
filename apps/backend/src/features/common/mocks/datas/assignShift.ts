import { faker } from "@faker-js/faker";

import type { $Enums } from "@prisma/client";
import type { ShiftsOfAssignType } from "@shared/common/types/json";
import { mockRequests } from "./shiftRequest";

export const assignShiftMock: ShiftsOfAssignType[] = [
	{
		userId: "user-001",
		userName: "たろう",
		shifts: [
			{ date: "2025-04-15", time: "09:00-13:00" },
			{ date: "2025-04-16", time: "14:00-18:00" },
		],
	},
	{
		userId: "user-002",
		userName: "じろう",
		shifts: [
			{ date: "2025-04-15", time: "10:00-14:00" },
			{ date: "2025-04-17", time: "12:00-16:00" },
			{ date: "2025-04-18", time: "09:00-12:00" },
		],
	},
];

export const upsertMockShiftRequestInput = (
	status: $Enums.RequestStatus,
	start: string,
	end: string,
	dead: string,
) => ({
	id: faker.string.uuid(),
	createdAt: new Date(),
	updatedAt: new Date(),
	storeId: faker.string.uuid(),
	weekStart: start,
	weekEnd: end,
	requests: mockRequests,
	status: status,
	deadline: dead,
});
