import type {
	ErrorResponse,
	ValidationErrorResponse,
} from "@shared/api/common/types/errors";
import type { LineMessageAPIResponse } from "@shared/api/webhook/line/types";
import { RequestShiftMessageValidate } from "@shared/api/webhook/line/validatioins";
import { MDW, YMDHM } from "@shared/utils/formatDate";
import type { Request, Response } from "express";
import { URI_DASHBOARD } from "../../../../lib/env";
import { verifyUserStoreForOwnerAndManager } from "../../../common/authorization.service";
import { sendGroupFlexMessage } from "../service";

const sendShiftRequestFuncController = async (
	req: Request,
	res: Response<
		LineMessageAPIResponse | ErrorResponse | ValidationErrorResponse
	>,
) => {
	try {
		const userId = req.userId as string;
		const storeId = req.storeId as string;
		const groupId = req.groupId as string;
		await verifyUserStoreForOwnerAndManager(userId, storeId);

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
		const { shiftRequestId, startDate, endDate, deadline } = parsed.data;

		await sendGroupFlexMessage(groupId, {
			text1: "シフト希望提出のお知らせ🔔",
			text2: `期間：${MDW(new Date(startDate))} 〜 ${MDW(new Date(endDate))}`,
			text3: `提出期限：${YMDHM(new Date(deadline))}`,
			label: "シフト希望提出",
			uri: `${URI_DASHBOARD}?storeId=${storeId}&shiftRequestId=${shiftRequestId}`,
		});

		res
			.status(200)
			.json({ ok: true, message: "successfully sent shift request" });
	} catch (error) {
		console.error("❌ Webhook処理エラー:", error);
		res.status(500).json({ ok: false, message: "Failed to send message " });
	}
};

export default sendShiftRequestFuncController;
