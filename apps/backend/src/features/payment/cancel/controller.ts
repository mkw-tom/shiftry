import type { ErrorResponse } from "@shared/api/common/types/errors.js";
import type { CancelSubscriptionResponse } from "@shared/api/payment/types/cancel.js";
import type { Request, Response } from "express";
import { verifyUserStoreForOwner } from "../../common/authorization.service.js";
import cancelSubscriptionService from "./service.js";

const cancelSubscriptionController = async (
	req: Request,
	res: Response<CancelSubscriptionResponse | ErrorResponse>,
): Promise<void> => {
	try {
		const userId = req.userId as string;
		const storeId = req.storeId as string;
		await verifyUserStoreForOwner(userId, storeId);

		const { canceledPayment, cancelDate } = await cancelSubscriptionService({
			storeId,
		});

		res.status(200).json({ ok: true, canceledPayment, cancelDate });
	} catch (error) {
		console.error("Cancel subscription error:", error);
		res
			.status(500)
			.json({ ok: false, message: "Failed to cancel subscription" });
	}
};

export default cancelSubscriptionController;
