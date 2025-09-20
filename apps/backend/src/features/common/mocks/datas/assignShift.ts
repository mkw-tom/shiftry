import { faker } from "@faker-js/faker";

import type { $Enums } from "@prisma/client";
import type { ShiftsOfAssignType } from "@shared/api/common/types/json.js";
import { mockRequests } from "./shiftRequest.js";

export const assignShiftMock: ShiftsOfAssignType[] = [
	{
		"2025-10-20": {
			"05:00-08:30": {
				name: "あさ",
				count: 2,
				jobRoles: [],
				assigned: [
					{
						uid: "u_001",
						displayName: "山田太郎",
						pictureUrl: "XXXXXXX",
						source: "auto",
						confirmed: false,
					},
					{
						uid: "u_002",
						displayName: "金城さいこ",
						pictureUrl: "XXXXXXX",
						source: "manual",
						confirmed: true,
					},
				],
				vacancies: 0,
				status: "confirmed",
				updatedAt: "2025-09-10T04:30:00.000Z",
				updatedBy: "owner_999",
			},
			"18:00-22:00": {
				name: "よる",
				count: 2,
				jobRoles: [],
				assigned: [
					{
						uid: "u_003",
						displayName: "佐々木小次郎",
						pictureUrl: "XXXXXXX",
						source: "priority",
						confirmed: true,
					},
					{
						uid: "u_004",
						displayName: "室山てつ",
						pictureUrl: "XXXXXXX",
						source: "auto",
						confirmed: false,
					},
				],
				vacancies: 0,
				status: "proposed",
				updatedAt: "2025-09-10T04:31:00.000Z",
				updatedBy: "system",
			},
		},
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
