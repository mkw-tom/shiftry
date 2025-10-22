import { liffUrl } from "../../../../../lib/env.js";
import { generateJWT } from "../../../../../utils/JWT/jwt.js";
import { sendGroupMessageByTrigger } from "../../service.js";
import { createStagingData } from "./createStagingData.js";

export const joinUseCase = async (replyToken: string, groupId: string) => {
	try {
		const groupId_jwt = generateJWT({ groupId });
		const signedUrl = `${liffUrl.connectLineGroupPage}?groupId=${groupId_jwt}`;

		const joinMessage = {
			text1: "グループに招待ありがとうございます！🎉",
			text2: "今日からシフト作成をお手伝いします！",
			text3: "オーナー様のみ連携お願いします！",
			label: "LINEグループ連携",
			uri: signedUrl,
		};

		await createStagingData(groupId);
		await sendGroupMessageByTrigger(replyToken, joinMessage);

		return { ok: true, message: "Join use case executed successfully" };
	} catch (error) {
		console.error("❌ Webhook処理エラー:", error);
	}
};
