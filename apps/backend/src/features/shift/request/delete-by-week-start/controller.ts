import type { ErrorResponse } from "@shared/api/common/types/errors.js";
import type { DeleteShiftRequestResponse } from "@shared/api/shift/request/types/delete-by-week-start.js";
import type { Request, Response } from "express";
import { deleteShiftRequest } from "../../../../repositories/shiftRequest.repository.js";
import { verifyUserStoreForOwnerAndManager } from "../../../common/authorization.service.js";

const deleteShiftRequestController = async (
	req: Request,
	res: Response<DeleteShiftRequestResponse | ErrorResponse>,
): Promise<void> => {
	try {
		const userId = req.userId as string;
		const storeId = req.storeId as string;
		await verifyUserStoreForOwnerAndManager(userId, storeId);

		const weekStart = req.params.weekStart;

		const shiftRequest = await deleteShiftRequest(storeId, weekStart);

		res.json({ ok: true, shiftRequest });
	} catch (error) {
		console.error(error);
		res.status(500).json({ ok: false, message: "Internal Server Error" });
	}
};

export default deleteShiftRequestController;
