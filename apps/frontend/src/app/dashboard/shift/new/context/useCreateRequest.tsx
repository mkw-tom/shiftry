"use client";
import { useToast } from "@/app/dashboard/common/context/ToastProvider";
import { useBottomDrawer } from "@/app/dashboard/common/context/useBottomDrawer";
import type { Member } from "@shared/api/common/types/prismaLite";
import type { UpsertShiftRequetType } from "@shared/api/shift/request/validations/put";
import type { bulkUpsertShiftPositionType } from "@shared/api/shiftPosition/validations/put-bulk";
import { formatDateToYYYYMMDD } from "@shared/utils/formatDate";
import { convertDateToWeekByEnglish } from "@shared/utils/formatWeek";
import { createServerSearchParamsForServerPage } from "next/dist/server/request/search-params";
import { type ReactNode, createContext, useContext, useState } from "react";

export const dummyShiftPositions: bulkUpsertShiftPositionType = [
	{
		name: "厨房・ホール",
		startTime: "2025-08-04T10:00:00.000Z",
		endTime: "2025-08-04T10:00:00.000Z",
		jobRoles: ["洗い物", "レジ"],
		count: 2,
		weeks: ["monday", "tuesday", "wednesday", "thursday", "friday"],
		absolute: [
			{
				id: "1",
				name: "スパイダー",
				pictureUrl:
					"https://img.daisyui.com/images/profile/demo/spiderperson@192.webp",
			},
		],
		priority: [
			{
				id: "1",
				name: "山田太郎",
				pictureUrl:
					"https://img.daisyui.com/images/profile/demo/averagebulk@192.webp",
			},
		],
	},
	{
		name: "ホール",
		startTime: "2025-08-04T10:00:00.000Z",
		endTime: "2025-08-04T10:00:00.000Z",
		jobRoles: ["レジ", "接客"],
		count: 2,
		weeks: ["saturday", "sunday"],
		absolute: [
			{
				id: "1",
				name: "山田太郎",
				pictureUrl:
					"https://img.daisyui.com/images/profile/demo/averagebulk@192.webp",
			},
		],
		priority: [
			{
				id: "1",
				name: "スパイダー",
				pictureUrl:
					"https://img.daisyui.com/images/profile/demo/spiderperson@192.webp",
			},
			{
				id: "2",
				name: "スパイダー",
				pictureUrl:
					"https://img.daisyui.com/images/profile/demo/spiderperson@192.webp",
			},
		],
	},
];

export const Dummymembers: Member[] = [
	{
		role: "OWNER", // or "STAFF" など
		user: {
			id: "u1",
			name: "山田太郎",
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
			id: "u2",
			name: "佐藤花子",
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
			id: "u3",
			name: "山田太郎",
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
			id: "u4",
			name: "佐藤花子",
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
			id: "u4",
			name: "佐藤花子",
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
			id: "u4",
			name: "佐藤花子",
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
			id: "u4",
			name: "佐藤花子",
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
			id: "u4",
			name: "佐藤花子",
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
			id: "u4",
			name: "佐藤花子",
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
			id: "u4",
			name: "佐藤花子",
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

type CreateRequestContextType = {
	step: CreateRequestStep;
	setStep: React.Dispatch<React.SetStateAction<CreateRequestStep>>;
	nextStep: () => void;
	prevStep: () => void;
	formData: UpsertShiftRequetType;
	setFormData: React.Dispatch<React.SetStateAction<UpsertShiftRequetType>>;
	shiftPositioins: bulkUpsertShiftPositionType;
	setShiftPositions: React.Dispatch<
		React.SetStateAction<bulkUpsertShiftPositionType>
	>;
};

export type CreateRequestStep =
	| "select_date"
	| "regist_position"
	| "adjust_position"
	| "preview"
	| "confirm";

export const formDataInit: UpsertShiftRequetType = {
	type: "WEEKLY",
	weekStart: "",
	weekEnd: "",
	deadline: "",
	status: "HOLD",
	requests: {},
};

const createRequestContext = createContext<
	CreateRequestContextType | undefined
>(undefined);

export const useCreateRequest = () => {
	const context = useContext(createRequestContext);
	if (context === undefined) {
		throw new Error(
			"useCreateRequest must be used within a CreateRequestProvider",
		);
	}
	return context;
};

export const CreateRequestProvider = ({
	children,
}: {
	children: ReactNode;
}) => {
	const [step, setStep] = useState<CreateRequestStep>("select_date");
	const [formData, setFormData] = useState<UpsertShiftRequetType>(formDataInit);
	const [shiftPositioins, setShiftPositions] =
		useState<bulkUpsertShiftPositionType>(dummyShiftPositions);

	const { drawerClose } = useBottomDrawer();
	const { showToast } = useToast();

	function nextStep() {
		switch (step) {
			case "select_date":
				setStep("regist_position");
				break;
			case "regist_position":
				setFormData((prev) => {
					const newRequests: UpsertShiftRequetType["requests"] = {};
					const start = new Date(prev.weekStart);
					const end = new Date(prev.weekEnd);
					const allDates: Date[] = [];
					const current = new Date(start);
					while (current <= end) {
						allDates.push(new Date(current));
						current.setDate(current.getDate() + 1);
					}

					allDates.map((date) => {
						const dateStr = formatDateToYYYYMMDD(date); // "2025-08-04"
						const weekdayKey = convertDateToWeekByEnglish(date); // "monday"

						shiftPositioins.map((position) => {
							if (position.weeks.includes(weekdayKey)) {
								const startTime = new Date(position.startTime);
								const endTime = new Date(position.endTime);

								// ✅ JSTで "HH:mm" に変換
								const start = startTime.toLocaleTimeString("ja-JP", {
									hour: "2-digit",
									minute: "2-digit",
									hour12: false,
								});
								const end = endTime.toLocaleTimeString("ja-JP", {
									hour: "2-digit",
									minute: "2-digit",
									hour12: false,
								});

								const timeSlotStr = `${start}-${end}`;

								if (!newRequests[dateStr]) {
									newRequests[dateStr] = {};
								}

								newRequests[dateStr][timeSlotStr] = {
									name: position.name,
									count: position.count,
									jobRoles: position.jobRoles,
									absolute: position.absolute.map((staff) => ({
										id: staff.id,
										name: staff.name,
										pictureUrl: staff.pictureUrl,
									})),
									priority: position.priority.map((staff) => ({
										id: staff.id,
										name: staff.name,
										pictureUrl: staff.pictureUrl,
										level: 1,
									})),
								};
							}
						});
					});

					console.log("newRequests", newRequests);

					return {
						...prev,
						requests: newRequests,
					};
				});

				setStep("adjust_position");
				break;

			case "adjust_position":
				setStep("preview");
				break;
			case "preview":
				// setStep("confirm");
				setStep("select_date");
				showToast("リクエストが作成されました", "success");
				drawerClose();
				break;
			case "confirm":
				// Handle confirmation logic here, e.g., submit the form
				break;
			default:
				throw new Error("Unknown step");
		}
	}

	function prevStep() {
		switch (step) {
			case "regist_position":
				setStep("select_date");
				break;
			case "adjust_position":
				setStep("regist_position");
				break;
			case "preview":
				setStep("adjust_position");
				break;
			case "confirm":
				setStep("preview");
				break;
			default:
				throw new Error("Cannot go back from this step");
		}
	}

	return (
		<createRequestContext.Provider
			value={{
				step,
				setStep,
				nextStep,
				prevStep,
				formData,
				setFormData,
				shiftPositioins,
				setShiftPositions,
			}}
		>
			{children}
		</createRequestContext.Provider>
	);
};
