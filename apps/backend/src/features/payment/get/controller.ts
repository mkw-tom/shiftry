import type { Request, Response } from "express";

import type { ErrorResponse } from "@shared/api/common/types/errors";
import type { GetPaymentResponse } from "@shared/api/payment/types/get";
import { getPaymentByStoreId } from "../../../repositories/payment.repositroy";
import { verifyUserStoreForOwner } from "../../common/authorization.service";

const getPaymentController = async (
	req: Request,
	res: Response<GetPaymentResponse | ErrorResponse>,
): Promise<void> => {
	try {
		const userId = req.userId as string;
		const storeId = req.storeId as string;
		await verifyUserStoreForOwner(userId, storeId);

		const payment = await getPaymentByStoreId(storeId);
		if (!payment) {
			res.status(404).json({ ok: false, message: "payment data is not found" });
			return;
		}

		res.status(200).json({ ok: true, payment });
	} catch (error) {
		console.error(error);
		res.status(500).json({ ok: false, message: "faild get payment data" });
	}
};

export default getPaymentController;
