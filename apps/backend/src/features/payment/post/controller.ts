import type {
	ErrorResponse,
	ValidationErrorResponse,
} from "@shared/common/types/errors";
import type { CreatePaymentResponse } from "@shared/payment/types/post";
import { createPaymentValidate } from "@shared/payment/validations/post";
import type { Request, Response } from "express";
import { verifyUserStoreForOwner } from "../../common/authorization.service";
import createPaymentService from "./service";

const createPaymentController = async (
	req: Request,
	res: Response<
		CreatePaymentResponse | ValidationErrorResponse | ErrorResponse
	>,
): Promise<void> => {
	try {
		const userId = req.userId as string;
		const storeId = req.storeId as string;
		await verifyUserStoreForOwner(userId, storeId);

		const parsed = createPaymentValidate.safeParse(req.body);
		if (!parsed.success) {
			res.status(400).json({
				ok: false,
				message: "invalid priceId",
				errors: parsed.error.errors,
			});
			return;
		}

		const paymentInfos = parsed.data;
		const input = {
			userId,
			storeId,
			paymentInfos,
		};

		const payment = await createPaymentService(input);

		res.status(200).json({ ok: true, payment });
	} catch (error) {
		console.error(error);
		res.status(500).json({
			ok: false,
			message: "faild create payment data",
		});
	}
};

export default createPaymentController;
