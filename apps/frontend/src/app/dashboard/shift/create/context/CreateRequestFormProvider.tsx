"use client";
import type { Member } from "@shared/api/common/types/prismaLite";
import type { UpsertShiftRequetInput } from "@shared/api/shift/request/validations/put";
import type { bulkUpsertShiftPositionInput } from "@shared/api/shiftPosition/validations/put-bulk";

import { formatDateToYYYYMMDD } from "@shared/utils/formatDate";
import { convertDateToWeekByEnglish } from "@shared/utils/formatWeek";
import { type ReactNode, createContext, useContext, useState } from "react";
import { buildRequestsFromPositions } from "../utils/buildRequests";

// export const Dummymembers: Member[] = [
// 	{
// 		role: "OWNER", // or "STAFF" など
// 		user: {
// 			id: "u1",
// 			name: "山田太郎",
// 			pictureUrl:
// 				"https://img.daisyui.com/images/profile/demo/spiderperson@192.webp",
// 			jobRoles: [
// 				{
// 					roleId: "r1",
// 					role: {
// 						id: "r1",
// 						name: "レジ",
// 					},
// 				},
// 				{
// 					roleId: "r2",
// 					role: {
// 						id: "r2",
// 						name: "接客",
// 					},
// 				},
// 			],
// 		},
// 	},
// 	{
// 		role: "STAFF",
// 		user: {
// 			id: "u2",
// 			name: "佐藤花子",
// 			pictureUrl:
// 				"https://img.daisyui.com/images/profile/demo/averagebulk@192.webp",
// 			jobRoles: [
// 				{
// 					roleId: "r3",
// 					role: {
// 						id: "r3",
// 						name: "清掃",
// 					},
// 				},
// 			],
// 		},
// 	},
// 	{
// 		role: "OWNER", // or "STAFF" など
// 		user: {
// 			id: "u3",
// 			name: "山田太郎",
// 			pictureUrl:
// 				"https://img.daisyui.com/images/profile/demo/spiderperson@192.webp",
// 			jobRoles: [
// 				{
// 					roleId: "r1",
// 					role: {
// 						id: "r1",
// 						name: "レジ",
// 					},
// 				},
// 				{
// 					roleId: "r2",
// 					role: {
// 						id: "r2",
// 						name: "接客",
// 					},
// 				},
// 			],
// 		},
// 	},
// 	{
// 		role: "STAFF",
// 		user: {
// 			id: "u4",
// 			name: "佐藤花子",
// 			pictureUrl:
// 				"https://img.daisyui.com/images/profile/demo/averagebulk@192.webp",
// 			jobRoles: [
// 				{
// 					roleId: "r3",
// 					role: {
// 						id: "r3",
// 						name: "清掃",
// 					},
// 				},
// 			],
// 		},
// 	},
// 	{
// 		role: "STAFF",
// 		user: {
// 			id: "u4",
// 			name: "佐藤花子",
// 			pictureUrl:
// 				"https://img.daisyui.com/images/profile/demo/averagebulk@192.webp",
// 			jobRoles: [
// 				{
// 					roleId: "r3",
// 					role: {
// 						id: "r3",
// 						name: "清掃",
// 					},
// 				},
// 			],
// 		},
// 	},
// 	{
// 		role: "STAFF",
// 		user: {
// 			id: "u4",
// 			name: "佐藤花子",
// 			pictureUrl:
// 				"https://img.daisyui.com/images/profile/demo/averagebulk@192.webp",
// 			jobRoles: [
// 				{
// 					roleId: "r3",
// 					role: {
// 						id: "r3",
// 						name: "清掃",
// 					},
// 				},
// 			],
// 		},
// 	},
// 	{
// 		role: "STAFF",
// 		user: {
// 			id: "u4",
// 			name: "佐藤花子",
// 			pictureUrl:
// 				"https://img.daisyui.com/images/profile/demo/averagebulk@192.webp",
// 			jobRoles: [
// 				{
// 					roleId: "r3",
// 					role: {
// 						id: "r3",
// 						name: "清掃",
// 					},
// 				},
// 			],
// 		},
// 	},
// 	{
// 		role: "STAFF",
// 		user: {
// 			id: "u4",
// 			name: "佐藤花子",
// 			pictureUrl:
// 				"https://img.daisyui.com/images/profile/demo/averagebulk@192.webp",
// 			jobRoles: [
// 				{
// 					roleId: "r3",
// 					role: {
// 						id: "r3",
// 						name: "清掃",
// 					},
// 				},
// 			],
// 		},
// 	},
// 	{
// 		role: "STAFF",
// 		user: {
// 			id: "u4",
// 			name: "佐藤花子",
// 			pictureUrl:
// 				"https://img.daisyui.com/images/profile/demo/averagebulk@192.webp",
// 			jobRoles: [
// 				{
// 					roleId: "r3",
// 					role: {
// 						id: "r3",
// 						name: "清掃",
// 					},
// 				},
// 			],
// 		},
// 	},
// 	{
// 		role: "STAFF",
// 		user: {
// 			id: "u4",
// 			name: "佐藤花子",
// 			pictureUrl:
// 				"https://img.daisyui.com/images/profile/demo/averagebulk@192.webp",
// 			jobRoles: [
// 				{
// 					roleId: "r3",
// 					role: {
// 						id: "r3",
// 						name: "清掃",
// 					},
// 				},
// 			],
// 		},
// 	},
// ];

type CreateRequestContextType = {
	step: CreateRequestStep;
	setStep: React.Dispatch<React.SetStateAction<CreateRequestStep>>;
	nextStep: () => void;
	prevStep: () => void;
	formData: UpsertShiftRequetInput;
	setFormData: React.Dispatch<React.SetStateAction<UpsertShiftRequetInput>>;
	shiftPositioins: bulkUpsertShiftPositionInput;
	setShiftPositions: React.Dispatch<
		React.SetStateAction<bulkUpsertShiftPositionInput>
	>;
	allJobRoles: string[];
	setAllJobRoles: React.Dispatch<React.SetStateAction<string[]>>;
};

export type CreateRequestStep =
	| "select_date"
	| "regist_position"
	| "adjust_position"
	| "confirm";

export const formDataInit: UpsertShiftRequetInput = {
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
	const [formData, setFormData] =
		useState<UpsertShiftRequetInput>(formDataInit);
	const [shiftPositioins, setShiftPositions] =
		useState<bulkUpsertShiftPositionInput>([]);
	const [allJobRoles, setAllJobRoles] = useState<string[]>([
		// "レジ",
		// "品出し",
		// "接客",
		// "清掃",
		// "レジ締め",
		// "レジ管理",
	]);

	const nextStep = async () => {
		switch (step) {
			case "select_date":
				setStep("regist_position");
				console.log("formData in context:", formData);
				break;

			case "regist_position":
				setFormData((prev) => ({
					...prev,
					requests: buildRequestsFromPositions(prev, shiftPositioins),
				}));
				console.log("Positions:", shiftPositioins);
				console.log("Built Requests:", formData);
				setStep("adjust_position");
				break;

			case "adjust_position":
				setStep("confirm");
				break;

			default:
				throw new Error("Unknown step");
		}
	};

	function prevStep() {
		switch (step) {
			case "regist_position":
				setStep("select_date");
				break;
			case "adjust_position":
				setStep("regist_position");
				break;
			case "confirm":
				setStep("adjust_position");
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
				allJobRoles,
				setAllJobRoles,
			}}
		>
			{children}
		</createRequestContext.Provider>
	);
};
