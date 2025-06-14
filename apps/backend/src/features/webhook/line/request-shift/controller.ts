import type { ErrorResponse } from "@shared/common/types/errors";
import type { LineMessageAPIResponse } from "@shared/webhook/line/types";
import type { Request, Response } from "express";
import { URI_SHIFT_SUBMITTED } from "../../../../lib/env";
import { verifyUserStoreForOwnerAndManager } from "../../../common/authorization.service";
import { sendGroupFlexMessage } from "../service";

const sendShiftRequestFuncController = async (
	req: Request,
	res: Response<LineMessageAPIResponse | ErrorResponse>,
) => {
	try {
		const userId = req.userId as string;
		const storeId = req.storeId as string;
		const groupId = req.groupId as string;
		await verifyUserStoreForOwnerAndManager(userId, storeId);

		await sendGroupFlexMessage(groupId, {
			text1: "スタッフの皆さんへ🎉",
			text2: "以下のボタンから希望提出を必ずお願いします！",
			text3: "提出期限：",
			label: "シフト希望提出",
			uri: URI_SHIFT_SUBMITTED,
		});

		res.status(200).json({ ok: true, message: "sucess send a shift request" });
	} catch (error) {
		console.error("❌ Webhook処理エラー:", error);
		res.status(500).json({ ok: false, message: "Failed to send message " });
	}
};

export default sendShiftRequestFuncController;
