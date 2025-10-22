import type { ErrorResponse } from "@shared/api/common/types/errors.js";
import type { LineMessageAPIResponse } from "@shared/api/webhook/line/types.js";
import type { Request, Response } from "express";
import { liffUrl } from "../../../../lib/env.js";
import { sendGroupMessageByTrigger } from "../service.js";
import { joinUseCase } from "./services/join.usecase.js";
import { deleteLineStagingGroupById } from "../../../../repositories/lineStagingGroup.js";

const eventController = async (
  req: Request,
  res: Response<LineMessageAPIResponse | ErrorResponse>
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
          await joinUseCase(event.replyToken, event.source.groupId);
        } catch (error) {
          console.error("❌ Webhook処理エラー:", error);
        }
      }

      if (event.type === "leave" && event.source.groupId) {
        try {
          await deleteLineStagingGroupById(event.source.groupId);
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
