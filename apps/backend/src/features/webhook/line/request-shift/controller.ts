import type {
	ErrorResponse,
	ValidationErrorResponse,
} from "@shared/api/common/types/errors.js";
import type { LineMessageAPIResponse } from "@shared/api/webhook/line/types.js";
import { RequestShiftMessageValidate } from "@shared/api/webhook/line/validatioins.js";
import { MDW, YMDHM } from "@shared/utils/formatDate.js";
import type { Request, Response } from "express";
import { URI_DASHBOARD, aes } from "../../../../lib/env.js";
import { getStoreByIdAllData } from "../../../../repositories/store.repository.js";
import { decryptText } from "../../../../utils/aes.js";
import { verifyUserStoreForOwnerAndManager } from "../../../common/authorization.service.js";
import { sendGroupFlexMessage } from "../service.js";
import { sendShiftRequestFunService } from "./service.js";

const sendShiftRequestFuncController = async (
	req: Request,
	res: Response<
		LineMessageAPIResponse | ErrorResponse | ValidationErrorResponse
	>,
) => {
	try {
		const auth = req.auth;

		if (!auth || !auth.uid || !auth.sid) {
			return void res.status(401).json({ ok: false, message: "Unauthorized" });
		}

		const parsed = RequestShiftMessageValidate.safeParse(req.body);
		if (!parsed.success) {
			console.error("❌ リクエストのバリデーションエラー:", parsed.error);
			res.status(400).json({
				ok: false,
				message: "Invalid request data",
				errors: parsed.error.errors,
			});
			return;
		}
		const response = await sendShiftRequestFunService(
			auth.uid,
			auth.sid,
			parsed.data,
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
		res.status(500).json({
			ok: false,
			message: error instanceof Error ? error.message : String(error),
		});
	}
};

export default sendShiftRequestFuncController;
