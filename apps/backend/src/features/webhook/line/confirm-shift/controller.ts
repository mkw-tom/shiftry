import type { ErrorResponse } from "@shared/common/types/errors";
import type { LineMessageAPIResponse } from "@shared/webhook/line/types";
import type { Request, Response } from "express";
import { URI_SHIFT_SUBMITTED } from "../../../../lib/env";
import { verifyUserStoreForOwnerAndManager } from "../../../common/authorization.service";
import { sendGroupFlexMessage } from "../service";

const sendConfirmShiftFuncController = async (
	req: Request,
	res: Response<LineMessageAPIResponse | ErrorResponse>,
): Promise<void> => {
	try {
		const userId = req.userId as string;
		const storeId = req.storeId as string;
		const groupId = req.groupId as string;
		await verifyUserStoreForOwnerAndManager(userId, storeId);

		await sendGroupFlexMessage(groupId, {
			text1: "シフトが出来上がりました！",
			text2: "以下のボタンからシフト確認をお願いします！",
			text3: "期間：",
			label: "シフト確認",
			uri: URI_SHIFT_SUBMITTED,
		});

		res
			.status(200)
			.json({ ok: true, message: "sucess send a shift confirmed message" });
	} catch (error) {
		console.error("❌ Webhook処理エラー:", error);
		res.status(500).json({ ok: false, message: "Failed to send message " });
	}
};

export default sendConfirmShiftFuncController;
