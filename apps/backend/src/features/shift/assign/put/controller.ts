import type {
	ErrorResponse,
	ValidationErrorResponse,
} from "@shared/api/common/types/errors.js";
import type { UpsertAssigShiftResponse } from "@shared/api/shift/assign/types/put.js";
import {
	type ShiftsOfAssignType,
	upsertAssignShfitValidate,
} from "@shared/api/shift/assign/validations/put.js";
import type { Request, Response } from "express";
import { upsertAssignShfit } from "../../../../repositories/assingShift.repostory.js";
import { verifyUserStoreForOwnerAndManager } from "../../../common/authorization.service.js";

const upsertAssignShfitController = async (
	req: Request,
	res: Response<
		UpsertAssigShiftResponse | ValidationErrorResponse | ErrorResponse
	>,
): Promise<void> => {
	try {
		const auth = req.auth;
		if (!auth?.uid || !auth?.sid) {
			res.status(401).json({ ok: false, message: "Unauthorized" });
			return;
		}
		await verifyUserStoreForOwnerAndManager(auth.uid, auth.sid);

		const parsed = upsertAssignShfitValidate.safeParse(req.body);
		if (!parsed.success) {
			res.status(400).json({
				ok: false,
				message: "Invalid request value",
				errors: parsed.error.errors,
			});
			return;
		}

		const assignShift = await upsertAssignShfit(auth.sid, parsed.data);
		if (!assignShift) {
			res.status(404).json({ ok: false, message: "assignShfit is not found" });
			return;
		}
		const assignShiftDTO = {
			...assignShift,
			shifts: assignShift.shifts as ShiftsOfAssignType,
		};

		res.json({ ok: true, assignShift: assignShiftDTO });
	} catch (error) {
		console.error("Failed to upsert assign shift:", error);
		res.status(500).json({ ok: false, message: "Internal Server Error" });
	}
};

export default upsertAssignShfitController;
