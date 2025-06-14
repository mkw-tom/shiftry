import type { ErrorResponse } from "@shared/common/types/errors";
import type { CancelRevertResponse } from "@shared/payment/types/cancel-revert";
import type { Request, Response } from "express";
import { verifyUserStoreForOwner } from "../../common/authorization.service";
import cancelRevertService from "./service";

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
