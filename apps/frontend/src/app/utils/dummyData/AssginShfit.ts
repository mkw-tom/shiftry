import type { AssignShiftDTO } from "@shared/api/shift/assign/dto";
import type { UpsertAssignShfitInput } from "@shared/api/shift/assign/validations/put";

export const dummyAssignShift: AssignShiftDTO = {
	id: "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
	storeId: "store_12345678",
	shiftRequestId: "11111111-2222-3333-4444-555555555555",
	status: "ADJUSTMENT", // $Enums.ShiftStatus のいずれか

	shifts: {
		"2025-10-20": {
			"05:00-08:30": {
				name: "あさ",
				count: 2,
				jobRoles: ["レジ", "接客"],
				assigned: [],
				assignedCount: 0,
				vacancies: 2,
				status: "confirmed",
				updatedAt: "2025-09-10T04:30:00.000Z",
				updatedBy: "owner_999",
			},
			"18:00-22:00": {
				name: "よる",
				count: 2,
				jobRoles: ["ホール"],
				assigned: [],
				assignedCount: 0,
				vacancies: 2,
				status: "proposed",
				updatedAt: "2025-09-10T04:31:00.000Z",
				updatedBy: "system",
			},
		},
		"2025-10-21": {
			"09:00-13:00": {
				name: "午前",
				count: 1,
				jobRoles: ["洗い物"],
				assigned: [],
				assignedCount: 1,
				vacancies: 1,
				status: "draft",
				updatedAt: "2025-09-10T04:35:00.000Z",
				updatedBy: "system",
			},
		},
		"2025-10-22": {
			"09:00-12:00": {
				name: "午前",
				count: 2,
				jobRoles: ["洗い物"],
				assigned: [],
				assignedCount: 0,
				vacancies: 1,
				status: "draft",
				updatedAt: "2025-09-10T04:35:00.000Z",
				updatedBy: "system",
			},
		},
		"2025-10-23": {
			"05:00-08:30": {
				name: "朝",
				count: 2,
				jobRoles: ["レジ", "接客"],
				assigned: [],
				assignedCount: 0,
				vacancies: 2,
				status: "confirmed",
				updatedAt: "2025-09-10T04:30:00.000Z",
				updatedBy: "owner_999",
			},
		},
	},

	updatedAt: new Date("2025-09-10T05:00:00.000Z"),
	createdAt: new Date("2025-09-01T00:00:00.000Z"),
};

export const dummyAssignShiftInput: UpsertAssignShfitInput = {
	shiftRequestId: "11111111-2222-3333-4444-555555555555",
	status: "ADJUSTMENT", // SHIFT_STATUS のいずれか: draft/proposed/confirmed/published
	shifts: {
		"2025-10-20": {
			"05:00-08:30": {
				name: "あさ",
				count: 2,
				jobRoles: ["レジ", "接客"],
				assigned: [
					{
						uid: "user_001",
						displayName: "いちたろう",
						pictureUrl: "https://example.com/u001.png",
						source: "absolute",
						confirmed: false,
					},
					{
						uid: "user_002",
						displayName: "にたろう",
						pictureUrl: "https://example.com/u002.png",
						source: "absolute",
						confirmed: true,
					},
				],
				assignedCount: 2,
				vacancies: 0,
				status: "confirmed",
				updatedAt: "2025-09-10T04:30:00.000Z",
				updatedBy: "owner_999",
			},
			"18:00-22:00": {
				name: "よる",
				count: 2,
				jobRoles: ["ホール"],
				assigned: [
					{
						uid: "user_003",
						displayName: "さんたろう",
						pictureUrl: "https://example.com/u003.png",
						source: "absolute",
						confirmed: true,
					},
					{
						uid: "user_004",
						displayName: "したろう",
						pictureUrl: "https://example.com/u004.png",
						source: "absolute",
						confirmed: false,
					},
				],
				assignedCount: 2,
				vacancies: 0,
				status: "proposed",
				updatedAt: "2025-09-10T04:31:00.000Z",
				updatedBy: "system",
			},
		},
		"2025-10-21": {
			"09:00-13:00": {
				name: "午前",
				count: 1,
				jobRoles: ["洗い物"],
				assigned: [
					{
						uid: "user_005",
						displayName: "ごたろう",
						pictureUrl: "https://example.com/u005.png",
						source: "absolute",
						confirmed: true,
					},
				],
				assignedCount: 1,
				vacancies: 0,
				status: "draft",
				updatedAt: "2025-09-10T04:35:00.000Z",
				updatedBy: "system",
			},
		},
		"2025-10-22": {
			"09:00-13:00": {
				name: "午前",
				count: 2,
				jobRoles: ["洗い物"],
				assigned: [
					{
						uid: "user_006",
						displayName: "ろくたろう",
						pictureUrl: "https://example.com/u005.png",
						source: "absolute",
						confirmed: true,
					},
				],
				assignedCount: 1,
				vacancies: 1,
				status: "draft",
				updatedAt: "2025-09-10T04:35:00.000Z",
				updatedBy: "system",
			},
		},
	},
};
