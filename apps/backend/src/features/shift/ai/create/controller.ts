import { da } from "@faker-js/faker/.";
import type {
	ErrorResponse,
	ValidationErrorResponse,
} from "@shared/common/types/errors";
import type {
	ShiftsOfAssignType,
	shiftsOfSubmittedType,
} from "@shared/common/types/json";
import { ShiftStatus } from "@shared/common/types/prisma";
import {
	type ShiftsOfRequestsType,
	ShiftsOfRequestsValidate,
} from "@shared/shift/request/validations/put";
import { shiftsOfSubmittedValidate } from "@shared/shift/submit/validations/put";
import express from "express";
import type { Request, Response } from "express";
import { z } from "zod";
import { upsertAssignShfit } from "../../../../repositories/assingShift.repostory";
import {
	verifyUserForOwner,
	verifyUserStoreForOwner,
} from "../../../common/authorization.service";
import { parsePrioritiesFromAi } from "./parsePriorities.ai";
import { adjustShiftByPriorities } from "./service/adjustShiftByPriorities";
import { generateInitialShift } from "./service/generateInitialShift";
import upsertAssignShfitService from "./service/upsertAssignShift";
import { findUsersBelowMin } from "./utils/findUsersBelowMin";
import { generateDateWeekList } from "./utils/generateDateWeekList";
import { getUnassignedShift } from "./utils/getUnassignedShift";
import { parseAIJsonBlock } from "./utils/pareseAiJsonBlock";

export type DayOfWeek =
	| "Monday"
	| "Tuesday"
	| "Wednesday"
	| "Thursday"
	| "Friday"
	| "Saturday"
	| "Sunday";

export type SlotInfo = {
	date: string;
	time: string;
	assigned: number;
	required: number;
};

type CreateShiftResponse = {
	ok: true;
	assignedShifts: ShiftsOfAssignType;
	priorities: PriorityType[] | [] | undefined;
	adjustedShifts: ShiftsOfAssignType;
	unassignedShift: SlotInfo[];
	usersBelowMin: {
		userId: string;
		userName: string;
		assignedCount: number;
		requiredMin: number;
	}[];
};

export const shiftsOfSubmittedWithIdValidate = shiftsOfSubmittedValidate.extend(
	{
		userId: z.string(),
	},
);
export type shiftOfSubmittdWithUserId = z.infer<
	typeof shiftsOfSubmittedWithIdValidate
>;

export const priorityValidate = z.object({
	userId: z.string(),
	userName: z.string(),
	preferTime: z
		.union([
			z.enum(["morning", "afternoon"]),
			z.object({
				start: z.string(), // "09:00"
				end: z.string(), // "13:00"
			}),
		])
		.optional(),
	preferredDays: z
		.array(
			z.enum([
				"Monday",
				"Tuesday",
				"Wednesday",
				"Thursday",
				"Friday",
				"Saturday",
				"Sunday",
			]),
		)
		.optional(),
	preferMoreThan: z
		.array(
			z.object({
				userId: z.string(),
				userName: z.string(),
			}),
		)
		.optional(),
	weight: z.number().optional(),
});
export type PriorityType = z.infer<typeof priorityValidate>;

const CreateShiftValidate = z.object({
	shiftReqeustId: z.string().uuid(),
	startDate: z.string(),
	endDate: z.string(),
	shiftRequest: ShiftsOfRequestsValidate,
	submittedShifts: shiftsOfSubmittedWithIdValidate.array(),
	ownerRequests: z
		.object({
			text: z
				.string()
				.min(1, "空のテキストは無効です")
				.max(50, "テキストは50文字以内で入力してください"),
			weight: z
				.number()
				.min(1, "重みは1以上の整数で入力してください")
				.max(5, "重みは1~5の整数で入力してください"),
		})
		.array(),
});
export type CreateShiftValidateType = z.infer<typeof CreateShiftValidate>;

export type parsePrioritiesFromAiInput = {
	submittedShifts: shiftOfSubmittdWithUserId[];
	ownerRequests?: { text: string; weight: number }[];
};

export type ReviewAssignedShiftsServiceType = {
	assignedShifts: ShiftsOfAssignType;
	shiftRequest: ShiftsOfRequestsType;
	submittedShifts: shiftsOfSubmittedType[];
	priorities: PriorityType[] | [] | undefined;
};

const createShiftController = async (
	req: Request,
	res: Response<CreateShiftResponse | ValidationErrorResponse | ErrorResponse>,
): Promise<void> => {
	try {
		const userId = req.userId as string;
		const storeId = req.storeId as string;
		await verifyUserStoreForOwner(userId, storeId);

		const parsed = CreateShiftValidate.safeParse(req.body);
		if (!parsed.success) {
			res.status(400).json({
				ok: false,
				message: "Invalid request value",
				errors: parsed.error.errors,
			});
			return;
		}
		const {
			shiftReqeustId,
			submittedShifts,
			shiftRequest,
			startDate,
			endDate,
			ownerRequests,
		} = parsed.data;

		const assignedShifts = generateInitialShift(
			submittedShifts,
			shiftRequest,
			startDate,
			endDate,
		);

		const prioritiesResultText = await parsePrioritiesFromAi({
			submittedShifts: submittedShifts,
			ownerRequests: ownerRequests,
		});
		const priorities = parseAIJsonBlock(prioritiesResultText);

		const dateWeekList = generateDateWeekList(startDate, endDate);
		const adjustedShifts = adjustShiftByPriorities({
			shiftRequest,
			submittedShifts,
			priorities,
			dateWeekMap: dateWeekList,
		});

		const unassignedShift = getUnassignedShift(
			shiftRequest,
			adjustedShifts,
			startDate,
			endDate,
		);

		const totalWeeks = Math.ceil(Object.entries(dateWeekList).length / 7);
		const usersBelowMin = findUsersBelowMin(
			submittedShifts,
			adjustedShifts,
			totalWeeks,
		);

		const upsertData = {
			shiftReqeustId,
			shiftRequestId: shiftReqeustId,
			shifts: adjustedShifts,
			status: ShiftStatus.ADJUSTMENT,
		};
		await upsertAssignShfitService({ storeId, upsertData });

		res.status(200).json({
			ok: true,
			assignedShifts: assignedShifts,
			priorities: priorities,
			adjustedShifts: adjustedShifts,
			unassignedShift: unassignedShift,
			usersBelowMin: usersBelowMin,
		});
	} catch (error) {
		console.error("[/api/shift/ai/create] error:", error);
		res.status(500).json({
			ok: false,
			message: "シフト作成中にエラーが発生しました",
		});
	}
};

export default createShiftController;
