import { liffUrl } from "../../../../../lib/env.js";
import { sendGroupMessageByTrigger } from "../../service.js";

export const followService = async (replyToken: string) => {
	try {
		const followMessage = {
			text1: "オーナー様は、以下の手順で登録✨",
			text2: "1. オーナー＆店舗登録",
			text3: "2. 「SHIFTRY」をlineグループに招待",
			label: "登録へ進む",
			uri: liffUrl.registerOwnerPage,
		};

		await sendGroupMessageByTrigger(replyToken, followMessage);
	} catch (error) {
		console.error("❌ followService error:", error);
		throw new Error("followService failed");
	}
};
