// // ShiftPositionDTO型
// export type WeekDay = string;
// export type AbsDTO = { id: string; name: string };
// export type PriDTO = { id: string; name: string; level: number };
// export type ShiftPositionDTO = {
// 	id: string;
// 	name: string;
// 	startTime: Date;
// 	endTime: Date;
// 	count: number | null;
// 	weeks: WeekDay[];
// 	jobRoles: string[];
// 	absolute: AbsDTO[];
// 	priority: PriDTO[];
// };

// export const demoShiftPositions: ShiftPositionDTO[] = [
// 	// 2025-10-20
// 	{
// 		id: "2025-10-20_05:00-08:30",
// 		name: "あさ",
// 		startTime: new Date("2025-10-20T05:00:00"),
// 		endTime: new Date("2025-10-20T08:30:00"),
// 		count: 2,
// 		weeks: ["2025-10-20"],
// 		jobRoles: ["レジ", "接客"],
// 		absolute: [{ id: "user_001", name: "いちたろう" }],
// 		priority: [
// 			{ id: "user_006", name: "ろくたろう", level: 1 },
// 			{ id: "user_005", name: "ごたろう", level: 2 },
// 		],
// 	},
// 	{
// 		id: "2025-10-20_18:00-22:00",
// 		name: "よる",
// 		startTime: new Date("2025-10-20T18:00:00"),
// 		endTime: new Date("2025-10-20T22:00:00"),
// 		count: 2,
// 		weeks: ["2025-10-20"],
// 		jobRoles: ["ホール"],
// 		absolute: [],
// 		priority: [{ id: "user_002", name: "にたろう", level: 1 }],
// 	},
// 	// 2025-10-21
// 	{
// 		id: "2025-10-21_09:00-13:00",
// 		name: "午前",
// 		startTime: new Date("2025-10-21T09:00:00"),
// 		endTime: new Date("2025-10-21T13:00:00"),
// 		count: 1,
// 		weeks: ["2025-10-21"],
// 		jobRoles: ["洗い物"],
// 		absolute: [{ id: "user_005", name: "ごたろう" }],
// 		priority: [{ id: "user_003", name: "さんたろう", level: 2 }],
// 	},
// 	{
// 		id: "2025-10-21_18:00-22:00",
// 		name: "よる",
// 		startTime: new Date("2025-10-21T18:00:00"),
// 		endTime: new Date("2025-10-21T22:00:00"),
// 		count: 1,
// 		weeks: ["2025-10-21"],
// 		jobRoles: ["ホール"],
// 		absolute: [],
// 		priority: [{ id: "user_008", name: "はちたろう", level: 1 }],
// 	},
// 	// 2025-10-22
// 	{
// 		id: "2025-10-22_09:00-12:00",
// 		name: "テスト",
// 		startTime: new Date("2025-10-22T09:00:00"),
// 		endTime: new Date("2025-10-22T12:00:00"),
// 		count: 2,
// 		weeks: ["2025-10-22"],
// 		jobRoles: ["洗い物"],
// 		absolute: [{ id: "user_001", name: "いちたろう" }],
// 		priority: [
// 			{ id: "user_002", name: "にたろう", level: 1 },
// 			{ id: "user_003", name: "さんたろう", level: 1 },
// 		],
// 	},
// 	// 2025-10-23
// 	{
// 		id: "2025-10-23_05:00-08:30",
// 		name: "朝",
// 		startTime: new Date("2025-10-23T05:00:00"),
// 		endTime: new Date("2025-10-23T08:30:00"),
// 		count: 2,
// 		weeks: ["2025-10-23"],
// 		jobRoles: ["レジ", "接客"],
// 		absolute: [{ id: "user_001", name: "いちたろう" }],
// 		priority: [
// 			{ id: "user_004", name: "よんたろう", level: 1 },
// 			{ id: "user_006", name: "ろくたろう", level: 2 },
// 		],
// 	},
// 	{
// 		id: "2025-10-23_18:00-21:00",
// 		name: "早番よる",
// 		startTime: new Date("2025-10-23T18:00:00"),
// 		endTime: new Date("2025-10-23T21:00:00"),
// 		count: 1,
// 		weeks: ["2025-10-23"],
// 		jobRoles: ["ホール"],
// 		absolute: [],
// 		priority: [],
// 	},
// 	// 2025-10-24
// 	{
// 		id: "2025-10-24_09:00-12:00",
// 		name: "午前",
// 		startTime: new Date("2025-10-24T09:00:00"),
// 		endTime: new Date("2025-10-24T12:00:00"),
// 		count: 2,
// 		weeks: ["2025-10-24"],
// 		jobRoles: ["洗い物"],
// 		absolute: [],
// 		priority: [{ id: "user_003", name: "さんたろう", level: 1 }],
// 	},
// 	{
// 		id: "2025-10-24_18:00-23:00",
// 		name: "ロング夜",
// 		startTime: new Date("2025-10-24T18:00:00"),
// 		endTime: new Date("2025-10-24T23:00:00"),
// 		count: 2,
// 		weeks: ["2025-10-24"],
// 		jobRoles: ["ホール"],
// 		absolute: [],
// 		priority: [{ id: "user_002", name: "にたろう", level: 1 }],
// 	},
// 	// 2025-10-25
// 	{
// 		id: "2025-10-25_10:00-14:00",
// 		name: "土曜昼",
// 		startTime: new Date("2025-10-25T10:00:00"),
// 		endTime: new Date("2025-10-25T14:00:00"),
// 		count: 2,
// 		weeks: ["2025-10-25"],
// 		jobRoles: ["キッチン補助"],
// 		absolute: [],
// 		priority: [{ id: "user_007", name: "ななたろう", level: 1 }],
// 	},
// 	{
// 		id: "2025-10-25_18:00-22:00",
// 		name: "土曜夜",
// 		startTime: new Date("2025-10-25T18:00:00"),
// 		endTime: new Date("2025-10-25T22:00:00"),
// 		count: 2,
// 		weeks: ["2025-10-25"],
// 		jobRoles: ["ホール"],
// 		absolute: [],
// 		priority: [{ id: "user_002", name: "にたろう", level: 1 }],
// 	},
// 	// 2025-10-26
// 	{
// 		id: "2025-10-26_09:00-12:00",
// 		name: "日曜午前",
// 		startTime: new Date("2025-10-26T09:00:00"),
// 		endTime: new Date("2025-10-26T12:00:00"),
// 		count: 1,
// 		weeks: ["2025-10-26"],
// 		jobRoles: ["洗い物"],
// 		absolute: [],
// 		priority: [{ id: "user_001", name: "いちたろう", level: 2 }],
// 	},
// 	{
// 		id: "2025-10-26_12:00-16:00",
// 		name: "日曜昼",
// 		startTime: new Date("2025-10-26T12:00:00"),
// 		endTime: new Date("2025-10-26T16:00:00"),
// 		count: 1,
// 		weeks: ["2025-10-26"],
// 		jobRoles: ["レジ"],
// 		absolute: [],
// 		priority: [],
// 	},
// ];

// import type { Member } from "@shared/api/common/types/prismaLite";
// import type { TemplateShiftType } from "@shared/api/shift/ai/validations/post-adjust";
// import type { SubmissionsInput } from "@shared/api/shift/ai/validations/post-adjust";
// import type { CurrentAssignmentsType } from "@shared/api/shift/ai/validations/post-adjust";
// import type { AssignShiftDTO } from "@shared/api/shift/assign/dto";
// import type { SubmittedShiftDTO } from "@shared/api/shift/submit/dto";
// import type { StaffPreferenceDTO } from "@shared/api/staffPreference/dto";

// export const demoTemplateShift: TemplateShiftType = {
// 	id: "sr_week_demo_assigned_01",
// 	storeId: "shop_123",
// 	weekStart: new Date("2025-10-20T00:00:00.000Z"),
// 	weekEnd: new Date("2025-10-26T23:59:59.999Z"),
// 	type: "WEEKLY",
// 	status: "ADJUSTMENT",
// 	deadline: new Date("2025-10-19T23:59:59.999Z"),
// 	createdAt: new Date(new Date("2025-10-15T09:00:00.000Z")),
// 	updatedAt: new Date("2025-10-15T09:00:00.000Z"),
// 	requests: {
// 		"2025-10-20": {
// 			"05:00-08:30": {
// 				name: "あさ",
// 				count: 2,
// 				absolute: [{ id: "user_001", name: "いちたろう" }],
// 				jobRoles: ["レジ", "接客"],
// 				priority: [
// 					{ id: "user_006", name: "ろくたろう", level: 1 },
// 					{ id: "user_005", name: "ごたろう", level: 2 },
// 				],
// 			},
// 			"18:00-22:00": {
// 				name: "よる",
// 				count: 2,
// 				absolute: [],
// 				jobRoles: ["ホール"],
// 				priority: [{ id: "user_002", name: "にたろう", level: 1 }],
// 			},
// 		},
// 		"2025-10-21": {
// 			"09:00-13:00": {
// 				name: "午前",
// 				count: 1,
// 				absolute: [{ id: "user_005", name: "ごたろう" }],
// 				jobRoles: ["洗い物"],
// 				priority: [{ id: "user_003", name: "さんたろう", level: 2 }],
// 			},
// 			"18:00-22:00": {
// 				name: "よる",
// 				count: 1,
// 				absolute: [],
// 				jobRoles: ["ホール"],
// 				priority: [{ id: "user_008", name: "はちたろう", level: 1 }],
// 			},
// 		},
// 		"2025-10-22": {
// 			"09:00-12:00": {
// 				name: "テスト",
// 				count: 2,
// 				absolute: [{ id: "user_001", name: "いちたろう" }],
// 				jobRoles: ["洗い物"],
// 				priority: [
// 					{ id: "user_002", name: "にたろう", level: 1 },
// 					{ id: "user_003", name: "さんたろう", level: 1 },
// 				],
// 			},
// 		},
// 		"2025-10-23": {
// 			"05:00-08:30": {
// 				name: "朝",
// 				count: 2,
// 				absolute: [{ id: "user_001", name: "いちたろう" }],
// 				jobRoles: ["レジ", "接客"],
// 				priority: [
// 					{ id: "user_004", name: "よんたろう", level: 1 },
// 					{ id: "user_006", name: "ろくたろう", level: 2 },
// 				],
// 			},
// 			"18:00-21:00": {
// 				name: "早番よる",
// 				count: 1,
// 				absolute: [],
// 				jobRoles: ["ホール"],
// 				priority: [],
// 			},
// 		},
// 		"2025-10-24": {
// 			"09:00-12:00": {
// 				name: "午前",
// 				count: 2,
// 				absolute: [],
// 				jobRoles: ["洗い物"],
// 				priority: [{ id: "user_003", name: "さんたろう", level: 1 }],
// 			},
// 			"18:00-23:00": {
// 				name: "ロング夜",
// 				count: 2,
// 				absolute: [],
// 				jobRoles: ["ホール"],
// 				priority: [{ id: "user_002", name: "にたろう", level: 1 }],
// 			},
// 		},
// 		"2025-10-25": {
// 			"10:00-14:00": {
// 				name: "土曜昼",
// 				count: 2,
// 				absolute: [],
// 				jobRoles: ["キッチン補助"],
// 				priority: [{ id: "user_007", name: "ななたろう", level: 1 }],
// 			},
// 			"18:00-22:00": {
// 				name: "土曜夜",
// 				count: 2,
// 				absolute: [],
// 				jobRoles: ["ホール"],
// 				priority: [{ id: "user_002", name: "にたろう", level: 1 }],
// 			},
// 		},
// 		"2025-10-26": {
// 			"09:00-12:00": {
// 				name: "日曜午前",
// 				count: 1,
// 				absolute: [],
// 				jobRoles: ["洗い物"],
// 				priority: [{ id: "user_001", name: "いちたろう", level: 2 }],
// 			},
// 			"12:00-16:00": {
// 				name: "日曜昼",
// 				count: 1,
// 				absolute: [],
// 				jobRoles: ["レジ"],
// 				priority: [],
// 			},
// 		},
// 	},
// };

// export const demoSubmissions: SubmittedShiftDTO[] = [
// 	{
// 		id: "sub_001",
// 		shiftRequestId: "sr_week_demo_assigned_01",
// 		storeId: "shop_123",
// 		createdAt: new Date(new Date("2025-10-15T09:00:00.000Z")),
// 		updatedAt: new Date("2025-10-15T09:00:00.000Z"),
// 		userId: "user_001",
// 		status: "ADJUSTMENT",
// 		memo: "午前中心で入れます",
// 		shifts: {
// 			"2025-10-20": "09:00-13:00",
// 			"2025-10-21": "anytime",
// 			"2025-10-22": null,
// 			"2025-10-23": "18:00-22:00",
// 			"2025-10-24": "anytime",
// 			"2025-10-25": "10:00-12:00",
// 			"2025-10-26": "09:00-12:00",
// 		},
// 	},
// 	{
// 		id: "sub_002",
// 		shiftRequestId: "sr_week_demo_assigned_01",
// 		storeId: "shop_123",
// 		createdAt: new Date("2025-10-15T09:01:00.000Z"),
// 		updatedAt: new Date("2025-10-15T09:01:00.000Z"),
// 		userId: "user_002",
// 		status: "CONFIRMED",
// 		memo: "夜シフト希望多めです",
// 		shifts: {
// 			"2025-10-20": "18:00-22:00",
// 			"2025-10-21": "18:00-22:00",
// 			"2025-10-22": "anytime",
// 			"2025-10-23": null,
// 			"2025-10-24": "18:00-23:00",
// 			"2025-10-25": "18:00-22:00",
// 			"2025-10-26": "12:00-16:00",
// 		},
// 	},
// 	{
// 		id: "sub_003",
// 		shiftRequestId: "sr_week_demo_assigned_01",
// 		storeId: "shop_123",
// 		createdAt: new Date("2025-10-15T09:02:00.000Z"),
// 		updatedAt: new Date("2025-10-15T09:02:00.000Z"),
// 		userId: "user_003",
// 		status: "CONFIRMED",
// 		memo: "テスト期間のため短時間のみ",
// 		shifts: {
// 			"2025-10-20": null,
// 			"2025-10-21": "09:00-12:00",
// 			"2025-10-22": "anytime",
// 			"2025-10-23": null,
// 			"2025-10-24": "09:00-12:00",
// 			"2025-10-25": null,
// 			"2025-10-26": null,
// 		},
// 	},
// 	{
// 		id: "sub_004",
// 		shiftRequestId: "sr_week_demo_assigned_01",
// 		storeId: "shop_123",
// 		createdAt: new Date("2025-10-15T09:03:00.000Z"),
// 		updatedAt: new Date("2025-10-15T09:03:00.000Z"),
// 		userId: "user_004",
// 		status: "ADJUSTMENT",
// 		memo: "",
// 		shifts: {
// 			"2025-10-20": "05:00-08:30",
// 			"2025-10-21": null,
// 			"2025-10-22": "08:00-10:00",
// 			"2025-10-23": "05:00-08:30",
// 			"2025-10-24": null,
// 			"2025-10-25": "10:00-14:00",
// 			"2025-10-26": null,
// 		},
// 	},
// 	// {
// 	// 	id: "sub_005",
// 	// 	shiftRequestId: "sr_week_demo_assigned_01",
// 	// 	storeId: "shop_123",
// 	// 	createdAt: new Date("2025-10-15T09:04:00.000Z"),
// 	// 	updatedAt: new Date("2025-10-15T09:04:00.000Z"),
// 	// 	userId: "user_005",
// 	// 	status: "ADJUSTMENT",
// 	// 	memo: "",
// 	// 	shifts: {
// 	// 		"2025-10-20": "06:00-08:00",
// 	// 		"2025-10-21": "09:00-13:00",
// 	// 		"2025-10-22": null,
// 	// 		"2025-10-23": "anytime",
// 	// 		"2025-10-24": "12:00-15:00",
// 	// 		"2025-10-25": null,
// 	// 		"2025-10-26": "09:00-12:00",
// 	// 	},
// 	// },
// 	// {
// 	// 	id: "sub_006",
// 	// 	shiftRequestId: "sr_week_demo_assigned_01",
// 	// 	storeId: "shop_123",
// 	// 	createdAt: new Date("2025-10-15T09:05:00.000Z"),
// 	// 	updatedAt: new Date("2025-10-15T09:05:00.000Z"),
// 	// 	userId: "user_006",
// 	// 	status: "CONFIRMED",
// 	// 	memo: "朝だけOK",
// 	// 	shifts: {
// 	// 		"2025-10-20": "05:00-08:30",
// 	// 		"2025-10-21": "06:00-09:00",
// 	// 		"2025-10-22": null,
// 	// 		"2025-10-23": "05:00-08:30",
// 	// 		"2025-10-24": "06:00-10:00",
// 	// 		"2025-10-25": "08:00-12:00",
// 	// 		"2025-10-26": null,
// 	// 	},
// 	// },
// 	// {
// 	// 	id: "sub_007",
// 	// 	shiftRequestId: "sr_week_demo_assigned_01",
// 	// 	storeId: "shop_123",
// 	// 	createdAt: new Date("2025-10-15T09:06:00.000Z"),
// 	// 	updatedAt: new Date("2025-10-15T09:06:00.000Z"),
// 	// 	userId: "user_007",
// 	// 	status: "ADJUSTMENT",
// 	// 	memo: "土日優先",
// 	// 	shifts: {
// 	// 		"2025-10-20": null,
// 	// 		"2025-10-21": null,
// 	// 		"2025-10-22": null,
// 	// 		"2025-10-23": null,
// 	// 		"2025-10-24": null,
// 	// 		"2025-10-25": "anytime",
// 	// 		"2025-10-26": "anytime",
// 	// 	},
// 	// },
// 	// {
// 	// 	id: "sub_008",
// 	// 	shiftRequestId: "sr_week_demo_assigned_01",
// 	// 	storeId: "shop_123",
// 	// 	createdAt: new Date("2025-10-15T09:07:00.000Z"),
// 	// 	updatedAt: new Date("2025-10-15T09:07:00.000Z"),
// 	// 	userId: "user_008",
// 	// 	status: "CONFIRMED",
// 	// 	memo: "",
// 	// 	shifts: {
// 	// 		"2025-10-20": "18:00-22:00",
// 	// 		"2025-10-21": "anytime",
// 	// 		"2025-10-22": null,
// 	// 		"2025-10-23": "18:00-21:00",
// 	// 		"2025-10-24": null,
// 	// 		"2025-10-25": "12:00-16:00",
// 	// 		"2025-10-26": null,
// 	// 	},
// 	// },
// ];

// export const demoCurrentAssignments: CurrentAssignmentsType = {
// 	"2025-10-20": {
// 		"05:00-08:30": {
// 			name: "あさ",
// 			count: 2,
// 			jobRoles: ["レジ", "接客"],
// 			assigned: [
// 				{
// 					uid: "user_006",
// 					displayName: "ろくたろう",
// 					pictureUrl:
// 						"https://cdn.pixabay.com/photo/2017/11/10/05/48/user-2935527_1280.png",
// 					confirmed: true,
// 					source: "absolute",
// 				},
// 			],
// 			assignedCount: 1,
// 			vacancies: 1,
// 			status: "confirmed",
// 			updatedAt: "2025-10-15T09:00:00.000Z",
// 			updatedBy: "owner_999",
// 		},
// 		"18:00-22:00": {
// 			name: "よる",
// 			count: 2,
// 			jobRoles: ["ホール"],
// 			assigned: [],
// 			assignedCount: 0,
// 			vacancies: 2,
// 			status: "proposed",
// 			updatedAt: "2025-10-15T09:01:00.000Z",
// 			updatedBy: "system",
// 		},
// 	},
// 	"2025-10-21": {
// 		"09:00-13:00": {
// 			name: "午前",
// 			count: 1,
// 			jobRoles: ["洗い物"],
// 			assigned: [],
// 			assignedCount: 0,
// 			vacancies: 1,
// 			status: "draft",
// 			updatedAt: "2025-10-15T09:02:00.000Z",
// 			updatedBy: "system",
// 		},
// 		"18:00-22:00": {
// 			name: "よる",
// 			count: 1,
// 			jobRoles: ["ホール"],
// 			assigned: [
// 				{
// 					uid: "user_008",
// 					displayName: "はちたろう",
// 					pictureUrl:
// 						"https://cdn.pixabay.com/photo/2017/11/10/05/48/user-2935527_1280.png",
// 					confirmed: true,
// 					source: "priority",
// 				},
// 			],
// 			assignedCount: 1,
// 			vacancies: 0,
// 			status: "confirmed",
// 			updatedAt: "2025-10-15T09:03:00.000Z",
// 			updatedBy: "owner_999",
// 		},
// 	},
// 	"2025-10-22": {
// 		"09:00-12:00": {
// 			name: "テスト",
// 			count: 2,
// 			jobRoles: ["洗い物"],
// 			assigned: [],
// 			assignedCount: 0,
// 			vacancies: 2,
// 			status: "draft",
// 			updatedAt: "2025-10-15T09:04:00.000Z",
// 			updatedBy: "system",
// 		},
// 	},
// 	"2025-10-23": {
// 		"05:00-08:30": {
// 			name: "朝",
// 			count: 2,
// 			jobRoles: ["レジ", "接客"],
// 			assigned: [
// 				{
// 					uid: "user_004",
// 					displayName: "よんたろう",
// 					pictureUrl:
// 						"https://cdn.pixabay.com/photo/2017/11/10/05/48/user-2935527_1280.png",
// 					confirmed: true,
// 					source: "priority",
// 				},
// 			],
// 			assignedCount: 1,
// 			vacancies: 1,
// 			status: "confirmed",
// 			updatedAt: "2025-10-15T09:05:00.000Z",
// 			updatedBy: "owner_999",
// 		},
// 		"18:00-21:00": {
// 			name: "早番よる",
// 			count: 1,
// 			jobRoles: ["ホール"],
// 			assigned: [],
// 			assignedCount: 0,
// 			vacancies: 1,
// 			status: "draft",
// 			updatedAt: "2025-10-15T09:06:00.000Z",
// 			updatedBy: "system",
// 		},
// 	},
// 	"2025-10-24": {
// 		"09:00-12:00": {
// 			name: "午前",
// 			count: 2,
// 			jobRoles: ["洗い物"],
// 			assigned: [
// 				{
// 					uid: "user_003",
// 					displayName: "さんたろう",
// 					pictureUrl:
// 						"https://cdn.pixabay.com/photo/2017/11/10/05/48/user-2935527_1280.png",
// 					confirmed: true,
// 					source: "priority",
// 				},
// 			],
// 			assignedCount: 1,
// 			vacancies: 1,
// 			status: "proposed",
// 			updatedAt: "2025-10-15T09:07:00.000Z",
// 			updatedBy: "system",
// 		},
// 		"18:00-23:00": {
// 			name: "ロング夜",
// 			count: 2,
// 			jobRoles: ["ホール"],
// 			assigned: [],
// 			assignedCount: 0,
// 			vacancies: 2,
// 			status: "proposed",
// 			updatedAt: "2025-10-15T09:08:00.000Z",
// 			updatedBy: "system",
// 		},
// 	},
// 	"2025-10-25": {
// 		"10:00-14:00": {
// 			name: "土曜昼",
// 			count: 2,
// 			jobRoles: ["キッチン補助"],
// 			assigned: [
// 				{
// 					uid: "user_007",
// 					displayName: "ななたろう",
// 					pictureUrl:
// 						"https://cdn.pixabay.com/photo/2017/11/10/05/48/user-2935527_1280.png",
// 					confirmed: true,
// 					source: "priority",
// 				},
// 			],
// 			assignedCount: 1,
// 			vacancies: 1,
// 			status: "confirmed",
// 			updatedAt: "2025-10-15T09:09:00.000Z",
// 			updatedBy: "owner_999",
// 		},
// 		"18:00-22:00": {
// 			name: "土曜夜",
// 			count: 2,
// 			jobRoles: ["ホール"],
// 			assigned: [],
// 			assignedCount: 0,
// 			vacancies: 2,
// 			status: "draft",
// 			updatedAt: "2025-10-15T09:10:00.000Z",
// 			updatedBy: "system",
// 		},
// 	},
// 	"2025-10-26": {
// 		"09:00-12:00": {
// 			name: "日曜午前",
// 			count: 1,
// 			jobRoles: ["洗い物"],
// 			assigned: [],
// 			assignedCount: 0,
// 			vacancies: 1,
// 			status: "draft",
// 			updatedAt: "2025-10-15T09:11:00.000Z",
// 			updatedBy: "system",
// 		},
// 		"12:00-16:00": {
// 			name: "日曜昼",
// 			count: 1,
// 			jobRoles: ["レジ"],
// 			assigned: [],
// 			assignedCount: 0,
// 			vacancies: 1,
// 			status: "draft",
// 			updatedAt: "2025-10-15T09:12:00.000Z",
// 			updatedBy: "system",
// 		},
// 	},
// };

// export const demoAssignShift: AssignShiftDTO = {
// 	id: "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
// 	storeId: "store_12345678",
// 	shiftRequestId: "11111111-2222-3333-4444-555555555555",
// 	status: "ADJUSTMENT",
// 	shifts: demoCurrentAssignments,
// 	createdAt: new Date("2025-10-15T09:00:00.000Z"),
// 	updatedAt: new Date("2025-10-15T09:00:00.000Z"),
// };

// export const demoMembers: Member[] = [
// 	{
// 		role: "OWNER",
// 		user: {
// 			id: "user_001",
// 			name: "いちたろう",
// 			pictureUrl:
// 				"https://cdn.pixabay.com/photo/2017/11/10/05/48/user-2935527_1280.png",
// 			jobRoles: [
// 				{ roleId: "r1", role: { id: "r1", name: "レジ" } },
// 				{ roleId: "r2", role: { id: "r2", name: "洗い物" } },
// 				{ roleId: "r3", role: { id: "r3", name: "接客" } },
// 			],
// 		},
// 	},
// 	{
// 		role: "STAFF",
// 		user: {
// 			id: "user_002",
// 			name: "にたろう",
// 			pictureUrl:
// 				"https://cdn.pixabay.com/photo/2017/11/10/05/48/user-2935527_1280.png",
// 			jobRoles: [{ roleId: "r4", role: { id: "r4", name: "ホール" } }],
// 		},
// 	},
// 	{
// 		role: "STAFF",
// 		user: {
// 			id: "user_003",
// 			name: "さんたろう",
// 			pictureUrl:
// 				"https://cdn.pixabay.com/photo/2017/11/10/05/48/user-2935527_1280.png",
// 			jobRoles: [{ roleId: "r2", role: { id: "r2", name: "洗い物" } }],
// 		},
// 	},
// 	{
// 		role: "STAFF",
// 		user: {
// 			id: "user_004",
// 			name: "よんたろう",
// 			pictureUrl:
// 				"https://cdn.pixabay.com/photo/2017/11/10/05/48/user-2935527_1280.png",
// 			jobRoles: [
// 				{ roleId: "r1", role: { id: "r1", name: "レジ" } },
// 				{ roleId: "r3", role: { id: "r3", name: "接客" } },
// 			],
// 		},
// 	},
// 	{
// 		role: "STAFF",
// 		user: {
// 			id: "user_005",
// 			name: "ごたろう",
// 			pictureUrl:
// 				"https://cdn.pixabay.com/photo/2017/11/10/05/48/user-2935527_1280.png",
// 			jobRoles: [{ roleId: "r2", role: { id: "r2", name: "洗い物" } }],
// 		},
// 	},
// 	{
// 		role: "STAFF",
// 		user: {
// 			id: "user_006",
// 			name: "ろくたろう",
// 			pictureUrl:
// 				"https://cdn.pixabay.com/photo/2017/11/10/05/48/user-2935527_1280.png",
// 			jobRoles: [
// 				{ roleId: "r1", role: { id: "r1", name: "レジ" } },
// 				{ roleId: "r3", role: { id: "r3", name: "接客" } },
// 			],
// 		},
// 	},
// 	{
// 		role: "STAFF",
// 		user: {
// 			id: "user_007",
// 			name: "ななたろう",
// 			pictureUrl:
// 				"https://cdn.pixabay.com/photo/2017/11/10/05/48/user-2935527_1280.png",
// 			jobRoles: [{ roleId: "r5", role: { id: "r5", name: "キッチン補助" } }],
// 		},
// 	},
// 	{
// 		role: "STAFF",
// 		user: {
// 			id: "user_008",
// 			name: "はちたろう",
// 			pictureUrl:
// 				"https://cdn.pixabay.com/photo/2017/11/10/05/48/user-2935527_1280.png",
// 			jobRoles: [{ roleId: "r4", role: { id: "r4", name: "ホール" } }],
// 		},
// 	},
// ];

// export const dummyStaffPreferences: StaffPreferenceDTO[] = [
// 	{
// 		userId: "user_001",
// 		storeId: "shop_123",
// 		weekMin: 2,
// 		weekMax: 5,
// 		weeklyAvailability: {
// 			mon: "anytime",
// 			tue: "09:00-13:00",
// 			wed: "anytime",
// 			thu: "13:00-20:00",
// 			fri: "09:00-18:00",
// 			sat: "anytime",
// 			sun: "anytime",
// 		},
// 		note: "午前中心で希望",
// 		createdAt: new Date("2025-10-15T09:00:00.000Z"),
// 		updatedAt: new Date("2025-10-15T09:00:00.000Z"),
// 	},
// 	{
// 		userId: "user_002",
// 		storeId: "shop_123",
// 		weekMin: 3,
// 		weekMax: 6,
// 		weeklyAvailability: {
// 			mon: "18:00-22:00",
// 			tue: "anytime",
// 			wed: "anytime",
// 			thu: "anytime",
// 			fri: "18:00-23:00",
// 			sat: "18:00-22:00",
// 			sun: "12:00-16:00",
// 		},
// 		note: "夜シフト希望多め",
// 		createdAt: new Date("2025-10-15T09:01:00.000Z"),
// 		updatedAt: new Date("2025-10-15T09:01:00.000Z"),
// 	},
// 	{
// 		userId: "user_003",
// 		storeId: "shop_123",
// 		weekMin: 1,
// 		weekMax: 3,
// 		weeklyAvailability: {
// 			mon: "anytime",
// 			tue: "09:00-12:00",
// 			wed: "anytime",
// 			thu: "anytime",
// 			fri: "09:00-12:00",
// 			sat: "anytime",
// 			sun: "anytime",
// 		},
// 		note: "テスト期間のため短時間のみ",
// 		createdAt: new Date("2025-10-15T09:02:00.000Z"),
// 		updatedAt: new Date("2025-10-15T09:02:00.000Z"),
// 	},
// 	{
// 		userId: "user_004",
// 		storeId: "shop_123",
// 		weekMin: 2,
// 		weekMax: 4,
// 		weeklyAvailability: {
// 			mon: "05:00-08:30",
// 			tue: "anytime",
// 			wed: "08:00-10:00",
// 			thu: "05:00-08:30",
// 			fri: "anytime",
// 			sat: "10:00-14:00",
// 			sun: "anytime",
// 		},
// 		note: "",
// 		createdAt: new Date("2025-10-15T09:03:00.000Z"),
// 		updatedAt: new Date("2025-10-15T09:03:00.000Z"),
// 	},
// 	{
// 		userId: "user_005",
// 		storeId: "shop_123",
// 		weekMin: 2,
// 		weekMax: 5,
// 		weeklyAvailability: {
// 			mon: "06:00-08:00",
// 			tue: "09:00-13:00",
// 			wed: "anytime",
// 			thu: "anytime",
// 			fri: "12:00-15:00",
// 			sat: "anytime",
// 			sun: "09:00-12:00",
// 		},
// 		note: "",
// 		createdAt: new Date("2025-10-15T09:04:00.000Z"),
// 		updatedAt: new Date("2025-10-15T09:04:00.000Z"),
// 	},
// 	{
// 		userId: "user_006",
// 		storeId: "shop_123",
// 		weekMin: 1,
// 		weekMax: 3,
// 		weeklyAvailability: {
// 			mon: "05:00-08:30",
// 			tue: "06:00-09:00",
// 			wed: "anytime",
// 			thu: "05:00-08:30",
// 			fri: "06:00-10:00",
// 			sat: "08:00-12:00",
// 			sun: "anytime",
// 		},
// 		note: "朝だけOK",
// 		createdAt: new Date("2025-10-15T09:05:00.000Z"),
// 		updatedAt: new Date("2025-10-15T09:05:00.000Z"),
// 	},
// 	{
// 		userId: "user_007",
// 		storeId: "shop_123",
// 		weekMin: 1,
// 		weekMax: 2,
// 		weeklyAvailability: {
// 			mon: "anytime",
// 			tue: "anytime",
// 			wed: "anytime",
// 			thu: "anytime",
// 			fri: "anytime",
// 			sat: "anytime",
// 			sun: "anytime",
// 		},
// 		note: "土日優先",
// 		createdAt: new Date("2025-10-15T09:06:00.000Z"),
// 		updatedAt: new Date("2025-10-15T09:06:00.000Z"),
// 	},
// 	{
// 		userId: "user_008",
// 		storeId: "shop_123",
// 		weekMin: 2,
// 		weekMax: 4,
// 		weeklyAvailability: {
// 			mon: "18:00-22:00",
// 			tue: "anytime",
// 			wed: "anytime",
// 			thu: "18:00-21:00",
// 			fri: "anytime",
// 			sat: "12:00-16:00",
// 			sun: "anytime",
// 		},
// 		note: "",
// 		createdAt: new Date("2025-10-15T09:07:00.000Z"),
// 		updatedAt: new Date("2025-10-15T09:07:00.000Z"),
// 	},
// ];
