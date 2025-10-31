import type {
	ErrorResponse,
	ValidationErrorResponse,
} from "@shared/api/common/types/errors.js";
import type { UpsertSubmittedShfitResponse } from "@shared/api/shift/submit/types/put.js";
import {
	type SubmittedDataType,
	upsertSubmittedShiftValidate,
} from "@shared/api/shift/submit/validations/put.js";
import type { Request, Response } from "express";
import { upsertSubmittedShift } from "../../../../repositories/submittedShift.repository.js";
import { verifyUserStore } from "../../../common/authorization.service.js";
import { toSubmittedShiftDTO } from "../toDTO.js";
// import { convertToSubmittedCalender } from "./service.js";

const upsertSubmittedShiftController = async (
	req: Request,
	res: Response<
		UpsertSubmittedShfitResponse | ValidationErrorResponse | ErrorResponse
	>,
): Promise<void> => {
	try {
		const auth = req.auth;
		if (!auth?.uid || !auth?.sid) {
			res.status(401).json({ ok: false, message: "Unauthorized" });
			return;
		}
		await verifyUserStore(auth.uid, auth.sid);

		const parsed = upsertSubmittedShiftValidate.safeParse(req.body);
		if (!parsed.success) {
			console.log("Validation errors:", parsed.error.errors);
			res.status(400).json({
				ok: false,
				message: "Invalid request value",
				errors: parsed.error.errors,
			});
			return;
		}
		const submittedShiftRaw = await upsertSubmittedShift(
			auth.uid,
			auth.sid,
			parsed.data,
		);

		const submittedShift = toSubmittedShiftDTO(submittedShiftRaw);

		res.json({ ok: true, submittedShift });
	} catch (error) {
		console.error("Failed to upsert submitted shift:", error);
		res.status(500).json({ ok: false, message: "Internal Server Error" });
	}
};

export default upsertSubmittedShiftController;
