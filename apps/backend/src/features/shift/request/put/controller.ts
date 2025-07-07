import type {
	ErrorResponse,
	ValidationErrorResponse,
} from "@shared/api/common/types/errors";
import type { UpsertShiftRequetResponse } from "@shared/api/shift/request/types/put";
import { upsertShfitRequestValidate } from "@shared/api/shift/request/validations/put";
import type { Request, Response } from "express";
import { upsertShiftRequest } from "../../../../repositories/shiftRequest.repository";
import { verifyUserStoreForOwnerAndManager } from "../../../common/authorization.service";

const upsertShiftRequestController = async (
	req: Request,
	res: Response<
		UpsertShiftRequetResponse | ValidationErrorResponse | ErrorResponse
	>,
): Promise<void> => {
	try {
		const userId = req.userId as string;
		const storeId = req.storeId as string;
		await verifyUserStoreForOwnerAndManager(userId, storeId);

		const bodyParesed = upsertShfitRequestValidate.safeParse(req.body);
		if (!bodyParesed.success) {
			res.status(400).json({
				ok: false,
				message: "invalid request value",
				errors: bodyParesed.error.errors,
			});
			return;
		}
		const { weekStart, weekEnd, type, requests, status, deadline } =
			bodyParesed.data;

		const upsertData = {
			weekStart,
			weekEnd,
			type,
			requests,
			status,
			deadline,
		};

		const shiftRequest = await upsertShiftRequest(storeId, upsertData);

		res.status(200).json({ ok: true, shiftRequest });
	} catch (error) {
		console.error(error);
		res.status(500).json({ ok: false, message: "Internal Server Error" });
	}
};

export default upsertShiftRequestController;
