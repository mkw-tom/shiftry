// import type { ShiftRequestDTO } from "@shared/api/shift/request/dto";

// // 既存互換用（従来単体利用していた箇所があればそのまま使える）
// export const dummyShiftRequest: ShiftRequestDTO = {
// 	id: "sr1",
// 	storeId: "shop1",
// 	weekStart: new Date("2025-10-20T00:00:00.000Z"),
// 	weekEnd: new Date("2025-11-02T00:00:00.000Z"),
// 	deadline: new Date("2025-10-15T00:00:00.000Z"),
// 	status: "ADJUSTMENT",
// 	createdAt: new Date("2024-06-01T12:00:00Z"),
// 	updatedAt: new Date("2024-06-01T12:00:00Z"),
// 	type: "WEEKLY",
// 	requests: {
// 		"2025-10-20": {
// 			"05:00-08:30": {
// 				name: "あさ",
// 				count: 2,
// 				absolute: [
// 					{
// 						id: "user_001",
// 						name: "いちたろう",
// 						pictureUrl: "https://placehold.co/64x64",
// 					},
// 					{
// 						id: "user_006",
// 						name: "ろくたろう",
// 						pictureUrl: "https://placehold.co/64x64",
// 					},
// 				],
// 				jobRoles: [],
// 				priority: [
// 					{
// 						id: "user_002",
// 						name: "にたろう",
// 						pictureUrl: "https://placehold.co/64x64",
// 						level: 1,
// 					},
// 					{
// 						id: "user_003",
// 						name: "さんたろう",
// 						pictureUrl: "https://placehold.co/64x64",
// 						level: 2,
// 					},
// 					{
// 						id: "user_004",
// 						name: "よんたろう",
// 						pictureUrl: "https://placehold.co/64x64",
// 						level: 3,
// 					},
// 				],
// 			},
// 			"18:00-22:00": {
// 				name: "よる",
// 				count: 2,
// 				absolute: [
// 					{
// 						id: "user_001",
// 						name: "いちたろう",
// 						pictureUrl: "https://placehold.co/64x64",
// 					},
// 				],
// 				jobRoles: [],
// 				priority: [
// 					{
// 						id: "user_002",
// 						name: "にたろう",
// 						pictureUrl: "https://placehold.co/64x64",
// 						level: 1,
// 					},
// 					{
// 						id: "user_007",
// 						name: "ななたろう",
// 						pictureUrl: "https://placehold.co/64x64",
// 						level: 2,
// 					},
// 				],
// 			},
// 		},
// 		"2025-10-21": {
// 			"09:00-13:00": {
// 				name: "午前",
// 				count: 1,
// 				absolute: [
// 					{
// 						id: "user_005",
// 						name: "ごたろう",
// 						pictureUrl: "https://placehold.co/64x64",
// 					},
// 				],
// 				jobRoles: ["洗い物"],
// 				priority: [
// 					{
// 						id: "user_008",
// 						name: "はちたろう",
// 						pictureUrl: "https://placehold.co/64x64",
// 						level: 1,
// 					},
// 					{
// 						id: "user_009",
// 						name: "くたろう",
// 						pictureUrl: "https://placehold.co/64x64",
// 						level: 2,
// 					},
// 				],
// 			},
// 		},
// 		"2025-10-22": {
// 			"09:00-12:00": {
// 				name: "テスト",
// 				count: 2,
// 				absolute: [
// 					{
// 						id: "user_001",
// 						name: "いちたろう",
// 						pictureUrl: "https://placehold.co/64x64",
// 					},
// 				],
// 				jobRoles: ["洗い物"],
// 				priority: [
// 					{
// 						id: "user_002",
// 						name: "にたろう",
// 						pictureUrl: "https://placehold.co/64x64",
// 						level: 1,
// 					},
// 					{
// 						id: "user_003",
// 						name: "さんたろう",
// 						pictureUrl: "https://placehold.co/64x64",
// 						level: 1,
// 					},
// 				],
// 			},
// 		},
// 		"2025-10-23": {
// 			"05:00-08:30": {
// 				name: "朝",
// 				count: 2,
// 				absolute: [
// 					{
// 						id: "user_001",
// 						name: "いちたろう",
// 						pictureUrl: "https://placehold.co/64x64",
// 					},
// 				],
// 				jobRoles: ["レジ", "接客"],
// 				priority: [
// 					{
// 						id: "user_004",
// 						name: "よんたろう",
// 						pictureUrl: "https://placehold.co/64x64",
// 						level: 3,
// 					},
// 					{
// 						id: "user_005",
// 						name: "ごたろう",
// 						pictureUrl: "https://placehold.co/64x64",
// 						level: 2,
// 					},
// 					{
// 						id: "user_006",
// 						name: "ろくたろう",
// 						pictureUrl: "https://placehold.co/64x64",
// 						level: 1,
// 					},
// 				],
// 			},
// 		},
// 		"2025-10-24": null,
// 		"2025-10-25": {
// 			"05:00-08:30": {
// 				name: "テスト",
// 				count: 2,
// 				absolute: [
// 					{
// 						id: "user_001",
// 						name: "いちたろう",
// 						pictureUrl: "https://placehold.co/64x64",
// 					},
// 				],
// 				jobRoles: [],
// 				priority: [],
// 			},
// 		},
// 		"2025-10-26": {
// 			"05:00-08:30": {
// 				name: "テスト",
// 				count: 2,
// 				absolute: [],
// 				jobRoles: [],
// 				priority: [],
// 			},
// 		},
// 		"2025-10-27": null,
// 		"2025-10-28": {
// 			"05:00-08:30": {
// 				name: "テスト",
// 				count: 2,
// 				absolute: [],
// 				jobRoles: [],
// 				priority: [],
// 			},
// 		},
// 		"2025-10-29": {
// 			"05:00-08:30": {
// 				name: "テスト",
// 				count: 2,
// 				absolute: [],
// 				jobRoles: [],
// 				priority: [],
// 			},
// 		},
// 		"2025-10-30": {
// 			"05:00-08:30": {
// 				name: "テスト",
// 				count: 2,
// 				absolute: [],
// 				jobRoles: [],
// 				priority: [],
// 			},
// 		},
// 		"2025-10-31": {
// 			"05:00-08:30": {
// 				name: "テスト",
// 				count: 2,
// 				absolute: [],
// 				jobRoles: [],
// 				priority: [],
// 			},
// 		},
// 		"2025-11-01": {
// 			"05:00-08:30": {
// 				name: "テスト",
// 				count: 2,
// 				absolute: [],
// 				jobRoles: [],
// 				priority: [],
// 			},
// 		},
// 		"2025-11-02": null,
// 	},
// };

// // 追加の複数ダミー
// export const dummyShiftRequests: ShiftRequestDTO[] = [
// 	dummyShiftRequest,
// 	{
// 		id: "sr2",
// 		storeId: "shop1",
// 		weekStart: new Date("2025-11-03T00:00:00.000Z"),
// 		weekEnd: new Date("2025-11-09T00:00:00.000Z"),
// 		deadline: new Date("2025-10-29T00:00:00.000Z"),
// 		status: "HOLD",
// 		type: "WEEKLY",
// 		createdAt: new Date("2024-06-05T12:00:00Z"),
// 		updatedAt: new Date("2024-06-05T12:00:00Z"),
// 		requests: {
// 			"2025-11-03": {
// 				"09:00-12:00": {
// 					name: "午前",
// 					count: 1,
// 					absolute: [],
// 					jobRoles: [],
// 					priority: [
// 						{
// 							id: "user_003",
// 							name: "さんたろう",
// 							pictureUrl: "https://placehold.co/64x64",
// 							level: 2,
// 						},
// 					],
// 				},
// 			},
// 			"2025-11-04": null,
// 			"2025-11-05": {
// 				"18:00-22:00": {
// 					name: "夜",
// 					count: 2,
// 					absolute: [
// 						{
// 							id: "user_002",
// 							name: "にたろう",
// 							pictureUrl: "https://placehold.co/64x64",
// 						},
// 					],
// 					jobRoles: [],
// 					priority: [],
// 				},
// 			},
// 			"2025-11-06": null,
// 			"2025-11-07": {
// 				"12:00-15:00": {
// 					name: "昼",
// 					count: 1,
// 					absolute: [],
// 					jobRoles: [],
// 					priority: [],
// 				},
// 			},
// 			"2025-11-08": null,
// 			"2025-11-09": null,
// 		},
// 	},
// 	{
// 		id: "sr3",
// 		storeId: "shop2",
// 		weekStart: new Date("2025-10-13T00:00:00.000Z"),
// 		weekEnd: new Date("2025-10-19T00:00:00.000Z"),
// 		deadline: new Date("2025-10-08T00:00:00.000Z"),
// 		status: "CONFIRMED",
// 		type: "WEEKLY",
// 		createdAt: new Date("2024-06-10T12:00:00Z"),
// 		updatedAt: new Date("2024-06-10T12:00:00Z"),
// 		requests: {
// 			"2025-10-13": {
// 				"09:00-12:00": {
// 					name: "午前",
// 					count: 2,
// 					absolute: [
// 						{
// 							id: "user_010",
// 							name: "じゅうたろう",
// 							pictureUrl: "https://placehold.co/64x64",
// 						},
// 					],
// 					jobRoles: [],
// 					priority: [],
// 				},
// 			},
// 			"2025-10-14": null,
// 			"2025-10-15": null,
// 			"2025-10-16": {
// 				"18:00-22:00": {
// 					name: "夜",
// 					count: 1,
// 					absolute: [],
// 					jobRoles: [],
// 					priority: [
// 						{
// 							id: "user_011",
// 							name: "じゅういち",
// 							pictureUrl: "https://placehold.co/64x64",
// 							level: 1,
// 						},
// 					],
// 				},
// 			},
// 			"2025-10-17": null,
// 			"2025-10-18": {
// 				"10:00-14:00": {
// 					name: "昼前",
// 					count: 1,
// 					absolute: [],
// 					jobRoles: [],
// 					priority: [],
// 				},
// 			},
// 			"2025-10-19": null,
// 		},
// 	},
// 	{
// 		id: "sr4",
// 		storeId: "shop1",
// 		weekStart: new Date("2025-12-01T00:00:00.000Z"),
// 		weekEnd: new Date("2025-12-07T00:00:00.000Z"),
// 		deadline: new Date("2025-11-26T00:00:00.000Z"),
// 		status: "REQUEST",
// 		type: "WEEKLY",
// 		createdAt: new Date("2024-06-20T12:00:00Z"),
// 		updatedAt: new Date("2024-06-20T12:00:00Z"),
// 		requests: {
// 			"2025-12-01": {
// 				"08:00-12:00": {
// 					name: "午前",
// 					count: 3,
// 					absolute: [],
// 					jobRoles: [],
// 					priority: [
// 						{
// 							id: "user_020",
// 							name: "はつか",
// 							pictureUrl: "https://placehold.co/64x64",
// 							level: 2,
// 						},
// 					],
// 				},
// 			},
// 			"2025-12-02": null,
// 			"2025-12-03": null,
// 			"2025-12-04": null,
// 			"2025-12-05": {
// 				"18:00-23:00": {
// 					name: "金夜",
// 					count: 2,
// 					absolute: [],
// 					jobRoles: [],
// 					priority: [],
// 				},
// 			},
// 			"2025-12-06": {
// 				"09:00-13:00": {
// 					name: "土午前",
// 					count: 2,
// 					absolute: [],
// 					jobRoles: [],
// 					priority: [],
// 				},
// 			},
// 			"2025-12-07": null,
// 		},
// 	},
// ];
