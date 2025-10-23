import type { ErrorResponse } from "@shared/api/common/types/errors.js";
import type { LineMessageAPIResponse } from "@shared/api/webhook/line/types.js";
import type { Request, Response } from "express";
import { hmac, liffUrl } from "../../../../lib/env.js";
import { deleteLineStagingGroupByHash } from "../../../../repositories/lineStagingGroup.js";
import { hmacSha256 } from "../../../../utils/hmac.js";
import { sendGroupMessageByTrigger } from "../service.js";
import { joinService } from "./services/join.service.js";

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
			if (event.type === "join" && event.source.groupId) {
				try {
					await joinService(event.replyToken, event.source.groupId);
				} catch (error) {
					console.error("❌ Webhook処理エラー:", error);
				}
			}

			// if (event.type === "leave" && event.source.groupId) {
			// 	try {
			// 		const groupId_hash = hmacSha256(
			// 			event.source.groupId,
			// 			hmac.saltGroupId,
			// 		);
			// 		await deleteLineStagingGroupByHash(event.source.groupId);
			// 	} catch (error) {
			// 		console.error("❌ Webhook処理エラー:", error);
			// 	}
			// }

			if (event.type === "follow" && event.source.userId) {
				try {
					const followMessage = {
						text1: "オーナー様は、以下の手順で登録✨",
						text2: "1. オーナー＆店舗登録",
						text3: "2. 「SHIFTRY」をlineグループに招待",
						label: "登録へ進む",
						uri: liffUrl.registerOwnerPage,
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
