import type { ErrorResponse } from "@shared/api/common/types/errors.js";
import type { CancelRevertResponse } from "@shared/api/payment/types/cancel-revert.js";
import type { Request, Response } from "express";
import { verifyUserStoreForOwner } from "../../common/authorization.service.js";
import cancelRevertService from "./service.js";

const cancelRevertController = async (
	req: Request,
	res: Response<CancelRevertResponse | ErrorResponse>,
): Promise<void> => {
	try {
		const userId = req.userId as string;
		const storeId = req.storeId as string;
		await verifyUserStoreForOwner(userId, storeId);

		const revertPayment = await cancelRevertService({ storeId });

		res.status(200).json({ ok: true, revertPayment });
	} catch (error) {
		console.error("Cancel revert error:", error);
		res
			.status(500)
			.json({ ok: false, message: "Failed to revert cancellation" });
	}
};

export default cancelRevertController;
