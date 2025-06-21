import type {
	ErrorResponse,
	ValidationErrorResponse,
} from "@shared/common/types/errors";
import { ShiftStatus } from "@shared/common/types/prisma";
import type { CreateShiftAiResponse } from "@shared/shift/ai/types/post-create";
import { CreateShiftAiValidate } from "@shared/shift/ai/validations/post-create";
import type { Request, Response } from "express";
import { verifyUserStoreForOwner } from "../../../common/authorization.service";
import { parsePrioritiesFromAi } from "./parsePriorities.ai";
import { adjustShiftByPriorities } from "./service/adjustShiftByPriorities";
import { generateInitialShift } from "./service/generateInitialShift";
import upsertAssignShfitService from "./service/upsertAssignShift";
import { findUsersBelowMin } from "./utils/findUsersBelowMin";
import { generateDateWeekList } from "./utils/generateDateWeekList";
import { getUnassignedShift } from "./utils/getUnassignedShift";
import { parseAIJsonBlock } from "./utils/pareseAiJsonBlock";

const createShiftController = async (
	req: Request,
	res: Response<
		CreateShiftAiResponse | ValidationErrorResponse | ErrorResponse
	>,
): Promise<void> => {
	try {
		const userId = req.userId as string;
		const storeId = req.storeId as string;
		await verifyUserStoreForOwner(userId, storeId);

		const parsed = CreateShiftAiValidate.safeParse(req.body);
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
