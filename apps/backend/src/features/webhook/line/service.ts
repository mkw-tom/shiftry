import type { MessageContens } from "@shared/api/webhook/line/types.js";
// import apiClient from "../../../config/axios.js";
import lineBot from "../../../config/line.js";

//☑️ トリガーを受け取ってメッセージ送信する
export const sendGroupMessageByTrigger = async (
	replyToken: string,
	messageContents: MessageContens,
): Promise<void> => {
	try {
		const { text1, text2, text3, label, uri } = messageContents;
		const message = {
			type: "flex" as const,
			altText: "LINEグループ連携のお願い",
			contents: {
				type: "bubble" as const,
				body: {
					type: "box" as const,
					layout: "vertical" as const,
					contents: [
						{
							type: "text" as const,
							text: text1,
							weight: "bold" as const,
							size: "md" as const,
							margin: "md" as const,
						},
						{
							type: "text" as const,
							text: text2,
							size: "sm" as const,
							margin: "sm" as const,
						},
						{
							type: "text" as const,
							text: text3,
							size: "sm" as const,
							margin: "md" as const,
						},
					],
				},
				footer: {
					type: "box" as const,
					layout: "vertical" as const,
					spacing: "sm" as const,
					contents: [
						{
							type: "button" as const,
							style: "primary" as const,
							color: "#1DB446", // LINEっぽい緑
							action: {
								type: "uri" as const,
								label: label,
								uri: uri,
							},
						},
					],
					flex: 0,
				},
			},
		};

		await lineBot.replyMessage({ replyToken, messages: [message] });
		// await apiClient.post("/v2/bot/message/reply", {
		// 	replyToken: replyToken,
		// 	messages: [message],
		// });

		console.log("✅ LINEメッセージ送信成功！");
	} catch (error) {
		console.error("❌ LINEメッセージ送信エラー:", error);
	}
};

//☑️ グループにメッセージ送信する
export const sendGroupFlexMessage = async (
	groupId: string,
	messageContents: MessageContens,
): Promise<void> => {
	try {
		const { text1, text2, text3, label, uri } = messageContents;

		const flexMessage = {
			type: "flex" as const,
			altText: "スタッフ登録のご案内",
			contents: {
				type: "bubble" as const,
				body: {
					type: "box" as const,
					layout: "vertical" as const,
					contents: [
						{
							type: "text" as const,
							text: text1,
							weight: "bold" as const,
							size: "md" as const,
							margin: "md" as const,
						},
						{
							type: "text" as const,
							text: text2,
							size: "sm" as const,
							margin: "sm" as const,
						},
						{
							type: "text" as const,
							text: text3,
							size: "sm" as const,
							margin: "md" as const,
						},
					],
				},
				footer: {
					type: "box" as const,
					layout: "vertical" as const,
					spacing: "sm" as const,
					contents: [
						{
							type: "button" as const,
							style: "primary" as const,
							color: "#1DB446",
							action: {
								type: "uri" as const,
								label: label,
								uri: uri,
							},
						},
					],
					flex: 0,
				},
			},
		};

		await lineBot.pushMessage({ to: groupId, messages: [flexMessage] });
		// await apiClient.post("/v2/bot/message/push", {
		// 	to: groupId,
		// 	messages: [flexMessage],
		// });

		console.log("✅ グループにFlexメッセージ送信成功！");
	} catch (error) {
		console.error("❌ グループへのFlexメッセージ送信失敗:", error);
		throw new Error("グループ通知に失敗しました");
	}
};
