import type { ErrorResponse } from "@shared/api/common/types/errors.js";
import type { LineMessageAPIResponse } from "@shared/api/webhook/line/types.js";
import type { Request, Response } from "express";
import {
	URI_CONNECT_LINE_GROUP,
	URI_REGISTER_OWNER,
} from "../../../../lib/env.js";
import { generateJWT } from "../../../../utils/JWT/jwt.js";
import { sendGroupMessageByTrigger } from "../service.js";

const eventController = async (
	req: Request,
	res: Response<LineMessageAPIResponse | ErrorResponse>,
): Promise<void> => {
	const events = req.body.events;

	if (!events) {
		res.status(400).json({ ok: false, message: "Missing required fields" });
		return;
	}

	try {
		for (const event of events) {
			/// 🔹 グループに招待された時の自動メッセージ
			if (event.type === "join" && event.source.groupId) {
				try {
					const group_token = generateJWT({ groupId: event.source.groupId });
					const signedUrl = `${URI_CONNECT_LINE_GROUP}?group_token=${group_token}`;

					const joinMessage = {
						text1: "グループに招待ありがとうございます！🎉",
						text2: "今日からシフト作成をお手伝いします！",
						text3: "オーナー様のみ連携お願いします！",
						label: "LINEグループ連携",
						uri: signedUrl,
					};

					await sendGroupMessageByTrigger(event.replyToken, joinMessage);
				} catch (error) {
					console.error("❌ Webhook処理エラー:", error);
				}
			}

			if (event.type === "follow" && event.source.userId) {
				try {
					const followMessage = {
						text1: "オーナー様は、以下の手順で登録✨",
						text2: "1. オーナー＆店舗登録",
						text3: "2. 「SHIFTRY」をlineグループに招待",
						label: "登録へ進む",
						uri: URI_REGISTER_OWNER,
					};

					await sendGroupMessageByTrigger(event.replyToken, followMessage);
				} catch (error) {
					console.error("❌ Webhook処理エラー:", error);
				}
			}
		}
		res.status(200).json({ ok: true, message: "OK" });
	} catch (error) {
		console.error("❌ Webhook処理エラー:", error);
		res.status(500).json({ ok: false, message: "internal server error" });
	}
};

export default eventController;
