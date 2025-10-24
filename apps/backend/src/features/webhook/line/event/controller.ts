import type { ErrorResponse } from "@shared/api/common/types/errors.js";
import type { LineMessageAPIResponse } from "@shared/api/webhook/line/types.js";
import type { Request, Response } from "express";
import { hmac, liffUrl } from "../../../../lib/env.js";
import { deleteLineStagingGroupByHash } from "../../../../repositories/lineStagingGroup.js";
import { hmacSha256 } from "../../../../utils/hmac.js";
import { sendGroupMessageByTrigger } from "../service.js";
import { followService } from "./services/followService.js";
import { joinService } from "./services/join.service.js";
import { memberJoinService } from "./services/memberJoin.service.js";

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
				await joinService(event.replyToken, event.source.groupId);
			}

			if (event.type === "follow" && event.replyToken) {
				await followService(event.replyToken);
			}

			if (
				event.type === "memberJoin" &&
				event.source.groupId &&
				event.joined?.members
			) {
				await memberJoinService(event.source.groupId, event.joined.members);
			}
		}
		res.status(200).json({ ok: true, message: "OK" });
	} catch (error) {
		console.error("❌ Webhook処理エラー:", error);
		res.status(500).json({ ok: false, message: "internal server error" });
	}
};

export default eventController;
