import type { MessageContens } from "@shared/api/webhook/line/types";
import apiClient from "../../../config/axios";

//☑️ トリガーを受け取ってメッセージ送信する
export const sendGroupMessageByTrigger = async (
	replyToken: string,
	messageContents: MessageContens,
): Promise<void> => {
	try {
		const { text1, text2, text3, label, uri } = messageContents;
		const message = {
			type: "flex",
			altText: "LINEグループ連携のお願い",
			contents: {
				type: "bubble",
				body: {
					type: "box",
					layout: "vertical",
					contents: [
						{
							type: "text",
							text: text1,
							weight: "bold",
							size: "md",
							margin: "md",
						},
						{
							type: "text",
							text: text2,
							size: "sm",
							margin: "sm",
						},
						{
							type: "text",
							text: text3,
							size: "sm",
							margin: "md",
						},
					],
				},
				footer: {
					type: "box",
					layout: "vertical",
					spacing: "sm",
					contents: [
						{
							type: "button",
							style: "primary",
							color: "#1DB446", // LINEっぽい緑
							action: {
								type: "uri",
								label: label,
								uri: uri,
							},
						},
					],
					flex: 0,
				},
			},
		};

		await apiClient.post("/v2/bot/message/reply", {
			replyToken: replyToken,
			messages: [message],
		});

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
			type: "flex",
			altText: "スタッフ登録のご案内",
			contents: {
				type: "bubble",
				body: {
					type: "box",
					layout: "vertical",
					contents: [
						{
							type: "text",
							text: text1,
							weight: "bold",
							size: "md",
							margin: "md",
						},
						{
							type: "text",
							text: text2,
							size: "sm",
							margin: "sm",
						},
						{
							type: "text",
							text: text3,
							size: "sm",
							margin: "md",
						},
					],
				},
				footer: {
					type: "box",
					layout: "vertical",
					spacing: "sm",
					contents: [
						{
							type: "button",
							style: "primary",
							color: "#1DB446",
							action: {
								type: "uri",
								label: label,
								uri: uri,
							},
						},
					],
					flex: 0,
				},
			},
		};

		await apiClient.post("/v2/bot/message/push", {
			to: groupId,
			messages: [flexMessage],
		});

		console.log("✅ グループにFlexメッセージ送信成功！");
	} catch (error) {
		console.error("❌ グループへのFlexメッセージ送信失敗:", error);
		throw new Error("グループ通知に失敗しました");
	}
};
