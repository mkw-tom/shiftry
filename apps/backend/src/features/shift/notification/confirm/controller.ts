import type {
	ErrorResponse,
	ValidationErrorResponse,
} from "@shared/api/common/types/errors.js";
import { upsertAssignShfitValidate } from "@shared/api/shift/assign/validations/put.js";
import type { NotificationConfirmShiftResponse } from "@shared/api/shift/notification/confirm/type.js";
import { upsertShiftRequestValidate } from "@shared/api/shift/request/validations/put.js";
import type { Request, Response } from "express";
import { verifyUserStoreForOwnerAndManager } from "../../../common/authorization.service.js";
import { notificationConfirmedShiftUsecase } from "./usecase.js";

const notificationConfirmedShiftController = async (
	req: Request,
	res: Response<
		NotificationConfirmShiftResponse | ValidationErrorResponse | ErrorResponse
	>,
): Promise<void> => {
	try {
		const auth = req.auth;
		if (!auth?.uid || !auth?.sid) {
			res.status(401).json({ ok: false, message: "Unauthorized" });
			return;
		}
		await verifyUserStoreForOwnerAndManager(auth.uid, auth.sid);

		const upsertShiftReqeustDataParsed = upsertShiftRequestValidate.safeParse(
			req.body.upsertShiftReqeustData,
		);
		if (!upsertShiftReqeustDataParsed.success) {
			res.status(400).json({
				ok: false,
				message: "invalid request value",
				errors: upsertShiftReqeustDataParsed.error.errors,
			});
			return;
		}
		const upsertAssignShiftDataParsed = upsertAssignShfitValidate.safeParse(
			req.body.upsertAssignShiftData,
		);
		if (!upsertAssignShiftDataParsed.success) {
			res.status(400).json({
				ok: false,
				message: "invalid request value",
				errors: upsertAssignShiftDataParsed.error.errors,
			});
			return;
		}

		const noticeRes = await notificationConfirmedShiftUsecase({
			sid: auth.sid,
			upsertShiftReqeustData: upsertShiftReqeustDataParsed.data,
			upsertAssignShiftData: upsertAssignShiftDataParsed.data,
		});

		res.status(200).json(noticeRes);
	} catch (error) {
		console.error(error);
		res.status(500).json({ ok: false, message: "Internal Server Error" });
	}
};

export default notificationConfirmedShiftController;
