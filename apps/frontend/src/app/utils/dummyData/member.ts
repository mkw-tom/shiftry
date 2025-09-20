import type { Member } from "@shared/api/common/types/prismaLite";

export const dummyMembers: Member[] = [
	{
		role: "OWNER", // or "STAFF" など
		user: {
			id: "user_001",
			name: "いちたろう",
			pictureUrl:
				"https://img.daisyui.com/images/profile/demo/spiderperson@192.webp",
			jobRoles: [
				{
					roleId: "r1",
					role: {
						id: "r1",
						name: "レジ",
					},
				},
				{
					roleId: "r2",
					role: {
						id: "r2",
						name: "接客",
					},
				},
			],
		},
	},
	{
		role: "STAFF",
		user: {
			id: "user_002",
			name: "にたろう",
			pictureUrl:
				"https://img.daisyui.com/images/profile/demo/averagebulk@192.webp",
			jobRoles: [
				{
					roleId: "r3",
					role: {
						id: "r3",
						name: "清掃",
					},
				},
			],
		},
	},
	{
		role: "OWNER", // or "STAFF" など
		user: {
			id: "user_003",
			name: "さんたろう",
			pictureUrl:
				"https://img.daisyui.com/images/profile/demo/spiderperson@192.webp",
			jobRoles: [
				{
					roleId: "r1",
					role: {
						id: "r1",
						name: "レジ",
					},
				},
				{
					roleId: "r2",
					role: {
						id: "r2",
						name: "接客",
					},
				},
			],
		},
	},
	{
		role: "STAFF",
		user: {
			id: "user_004",
			name: "したろう",
			pictureUrl:
				"https://img.daisyui.com/images/profile/demo/averagebulk@192.webp",
			jobRoles: [
				{
					roleId: "r3",
					role: {
						id: "r3",
						name: "清掃",
					},
				},
			],
		},
	},
	{
		role: "STAFF",
		user: {
			id: "user_005",
			name: "ごたろう",
			pictureUrl:
				"https://img.daisyui.com/images/profile/demo/averagebulk@192.webp",
			jobRoles: [
				{
					roleId: "r3",
					role: {
						id: "r3",
						name: "清掃",
					},
				},
			],
		},
	},
	{
		role: "STAFF",
		user: {
			id: "user_006",
			name: "ろくたろう",
			pictureUrl:
				"https://img.daisyui.com/images/profile/demo/averagebulk@192.webp",
			jobRoles: [
				{
					roleId: "r3",
					role: {
						id: "r3",
						name: "清掃",
					},
				},
			],
		},
	},
	{
		role: "STAFF",
		user: {
			id: "user_007",
			name: "ななたろう",
			pictureUrl:
				"https://img.daisyui.com/images/profile/demo/averagebulk@192.webp",
			jobRoles: [
				{
					roleId: "r3",
					role: {
						id: "r3",
						name: "清掃",
					},
				},
			],
		},
	},
	{
		role: "STAFF",
		user: {
			id: "user_008",
			name: "はちたろう",
			pictureUrl:
				"https://img.daisyui.com/images/profile/demo/averagebulk@192.webp",
			jobRoles: [
				{
					roleId: "r3",
					role: {
						id: "r3",
						name: "清掃",
					},
				},
			],
		},
	},
	{
		role: "STAFF",
		user: {
			id: "user_009",
			name: "くたろう",
			pictureUrl:
				"https://img.daisyui.com/images/profile/demo/averagebulk@192.webp",
			jobRoles: [
				{
					roleId: "r3",
					role: {
						id: "r3",
						name: "清掃",
					},
				},
			],
		},
	},
	{
		role: "STAFF",
		user: {
			id: "user_10",
			name: "じゅうたろう",
			pictureUrl:
				"https://img.daisyui.com/images/profile/demo/averagebulk@192.webp",
			jobRoles: [
				{
					roleId: "r3",
					role: {
						id: "r3",
						name: "清掃",
					},
				},
			],
		},
	},
];
