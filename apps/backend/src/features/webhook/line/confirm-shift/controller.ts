import type {
	ErrorResponse,
	ValidationErrorResponse,
} from "@shared/api/common/types/errors.js";
import type { LineMessageAPIResponse } from "@shared/api/webhook/line/types.js";
import { ConfirmShiftMessageValidate } from "@shared/api/webhook/line/validatioins.js";
import { MDW } from "@shared/utils/formatDate.js";
import type { Request, Response } from "express";
import prisma from "../../../../config/database.js";
import { URI_SHIFT_CONFIRMATION } from "../../../../lib/env.js";
import { verifyUserStoreForOwnerAndManager } from "../../../common/authorization.service.js";
import { sendGroupFlexMessage } from "../service.js";
import { sendConfirmedShiftService } from "./service.js";

const sendConfirmShiftFuncController = async (
	req: Request,
	res: Response<
		LineMessageAPIResponse | ErrorResponse | ValidationErrorResponse
	>,
): Promise<void> => {
	try {
		const auth = req.auth;

		if (!auth || !auth.uid || !auth.sid) {
			return void res.status(401).json({ ok: false, message: "Unauthorized" });
		}
		await verifyUserStoreForOwnerAndManager(auth.uid, auth.sid);

		const parse = ConfirmShiftMessageValidate.safeParse(req.body);
		if (!parse.success) {
			console.error("❌ リクエストのバリデーションエラー:", parse.error);
			res.status(400).json({
				ok: false,
				message: "Invalid request data",
				errors: parse.error.errors,
			});
			return;
		}

		const response = await sendConfirmedShiftService(
			auth.uid,
			auth.sid,
			parse.data,
		);
		if (!response.ok) {
			const msg = response.message ?? "Bad Request";
			const status = msg.includes("not found")
				? 404
				: msg.includes("permission")
					? 403
					: 400;
			return void res.status(status).json(response);
		}

		return void res.status(200).json(response);
	} catch (error) {
		console.error("❌ Webhook処理エラー:", error);
		res.status(500).json({ ok: false, message: "Failed to send message " });
	}
};

export default sendConfirmShiftFuncController;
