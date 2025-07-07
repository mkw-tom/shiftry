import type {
	ErrorResponse,
	ValidationErrorResponse,
} from "@shared/api/common/types/errors";
import { ShiftStatus } from "@shared/api/common/types/prisma";
import type { CreateShiftAiResponse } from "@shared/api/shift/ai/types/post-create";
import { CreateShiftAiValidate } from "@shared/api/shift/ai/validations/post-create";
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
			shiftRequestId,
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

		let adjustedShifts = assignedShifts;
		let priorities = [];
		if (ownerRequests.length > 0) {
			const prioritiesResultText = await parsePrioritiesFromAi({
				submittedShifts,
				ownerRequests,
			});
			priorities = parseAIJsonBlock(prioritiesResultText);

			const dateWeekList = generateDateWeekList(startDate, endDate);
			adjustedShifts = adjustShiftByPriorities({
				shiftRequest,
				submittedShifts,
				priorities,
				dateWeekMap: dateWeekList,
			});
		}

		const totalWeeks = Math.ceil(
			Object.entries(generateDateWeekList(startDate, endDate)).length / 7,
		);

		const resultShift =
			ownerRequests.length === 0 ? assignedShifts : adjustedShifts;

		const upsertData = {
			shiftRequestId,
			shifts: resultShift,
			status: ShiftStatus.ADJUSTMENT,
		};
		await upsertAssignShfitService({ storeId, upsertData });

		const unassignedShift = getUnassignedShift(
			shiftRequest,
			resultShift,
			startDate,
			endDate,
		);

		const usersBelowMin = findUsersBelowMin(
			submittedShifts,
			resultShift,
			totalWeeks,
		);

		res.status(200).json({
			ok: true,
			assignedShifts,
			priorities,
			adjustedShifts,
			unassignedShift,
			usersBelowMin,
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
