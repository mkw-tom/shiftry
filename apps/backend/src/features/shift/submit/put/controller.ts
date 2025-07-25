import type {
	ErrorResponse,
	ValidationErrorResponse,
} from "@shared/api/common/types/errors";
import type { UpsertSubmittedShfitResponse } from "@shared/api/shift/submit/types/put";
import { upsertSubmittedShiftValidate } from "@shared/api/shift/submit/validations/put";
import type { Request, Response } from "express";
import { upsertSubmittedShift } from "../../../../repositories/submittedShift.repository";
import { verifyUserStore } from "../../../common/authorization.service";
import { convertToSubmittedCalender } from "./service";

const upsertSubmittedShiftController = async (
	req: Request,
	res: Response<
		UpsertSubmittedShfitResponse | ValidationErrorResponse | ErrorResponse
	>,
): Promise<void> => {
	try {
		const userId = req.userId as string;
		const storeId = req.storeId as string;
		await verifyUserStore(userId, storeId);

		const parsed = upsertSubmittedShiftValidate.safeParse(req.body);
		if (!parsed.success) {
			res.status(400).json({
				ok: false,
				message: "Invalid request value",
				errors: parsed.error.errors,
			});
			return;
		}
		const { shifts, startDate, endDate } = parsed.data;
		const SubmittedCalendar = convertToSubmittedCalender(
			startDate,
			endDate,
			shifts.availableWeeks,
			shifts.specificDates,
		);

		const upsertData = {
			...parsed.data,
			shifts: SubmittedCalendar,
		};

		const submittedShift = await upsertSubmittedShift(
			userId,
			storeId,
			upsertData,
		);

		res.json({ ok: true, submittedShift });
	} catch (error) {
		console.error("Failed to upsert submitted shift:", error);
		res.status(500).json({ ok: false, message: "Internal Server Error" });
	}
};

export default upsertSubmittedShiftController;
