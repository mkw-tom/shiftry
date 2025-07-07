import type {
	ErrorResponse,
	ValidationErrorResponse,
} from "@shared/api/common/types/errors";
import type { LineMessageAPIResponse } from "@shared/api/webhook/line/types";
import { ConfirmShiftMessageValidate } from "@shared/api/webhook/line/validatioins";
import type { Request, Response } from "express";
import { URI_SHIFT_CONFIRMATION } from "../../../../lib/env";
import { verifyUserStoreForOwnerAndManager } from "../../../common/authorization.service";
import { sendGroupFlexMessage } from "../service";

const sendConfirmShiftFuncController = async (
	req: Request,
	res: Response<
		LineMessageAPIResponse | ErrorResponse | ValidationErrorResponse
	>,
): Promise<void> => {
	try {
		const userId = req.userId as string;
		const storeId = req.storeId as string;
		const groupId = req.groupId as string;
		await verifyUserStoreForOwnerAndManager(userId, storeId);

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
		const { shiftRequestId, startDate, endDate } = parse.data;
		await sendGroupFlexMessage(groupId, {
			text1: "シフトが出来上がりました！",
			text2: "以下のボタンからシフト確認をお願いします！",
			text3: `期間: ${startDate} 〜 ${endDate}`,
			label: "シフト確認",
			uri: `${URI_SHIFT_CONFIRMATION}/${shiftRequestId}`,
		});

		res.status(200).json({
			ok: true,
			message: "Successfully sent shift confirmation message",
		});
	} catch (error) {
		console.error("❌ Webhook処理エラー:", error);
		res.status(500).json({ ok: false, message: "Failed to send message " });
	}
};

export default sendConfirmShiftFuncController;
