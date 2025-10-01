import type {
	ErrorResponse,
	ValidationErrorResponse,
} from "@shared/api/common/types/errors.js";
import type { UpsertShiftRequetResponse } from "@shared/api/shift/request/types/put.js";
import {
	type RequestsType,
	upsertShiftRequestValidate,
} from "@shared/api/shift/request/validations/put.js";
import type { Request, Response } from "express";
import prisma from "../../../../config/database.js";
import { upsertShiftRequest } from "../../../../repositories/shiftRequest.repository.js";
import { verifyUserStoreForOwnerAndManager } from "../../../common/authorization.service.js";

const upsertShiftRequestController = async (
	req: Request,
	res: Response<
		UpsertShiftRequetResponse | ValidationErrorResponse | ErrorResponse
	>,
): Promise<void> => {
	try {
		const auth = req.auth;
		if (!auth?.uid || !auth?.sid) {
			res.status(401).json({ ok: false, message: "Unauthorized" });
			return;
		}
		await verifyUserStoreForOwnerAndManager(auth.uid, auth.sid);

		const prased = upsertShiftRequestValidate.safeParse(req.body);
		if (!prased.success) {
			res.status(400).json({
				ok: false,
				message: "invalid request value",
				errors: prased.error.errors,
			});
			return;
		}

		const shiftRequestRaw = await upsertShiftRequest(auth.sid, prased.data);

		const shiftRequest = {
			...shiftRequestRaw,
			requests: shiftRequestRaw.requests as RequestsType,
		};

		res.status(200).json({ ok: true, shiftRequest });
	} catch (error) {
		console.error(error);
		res.status(500).json({ ok: false, message: "Internal Server Error" });
	}
};

export default upsertShiftRequestController;
