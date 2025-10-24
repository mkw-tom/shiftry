import { StringDecoder } from "node:string_decoder";
import { aes, hmac, liffUrl } from "../../../../../lib/env.js";
import { getStoreByGroupIdHash } from "../../../../../repositories/store.repository.js";
import { decryptText } from "../../../../../utils/aes.js";
import { hmacSha256 } from "../../../../../utils/hmac.js";
import { sendGroupFlexMessage } from "../../service.js";

export const memberJoinService = async (groupId: string, joinMembers: []) => {
	try {
		const groupId_hash = hmacSha256(groupId, hmac.saltGroupId);
		const store = await getStoreByGroupIdHash(groupId_hash);
		const storeCode_enc = store?.storeCode?.code_enc;
		const storeCode = decryptText(storeCode_enc as string, {
			[aes.keyVersionStoreCode]: aes.keyStoreCode,
		});

		// 参加メンバー名抽出（displayNameがあれば使用）
		const memberNames = Array.isArray(joinMembers)
			? joinMembers.map((m: { displayName: string }) => m.displayName)
			: [];

		const namesText =
			memberNames.length > 0 ? `${memberNames.join("さん, ")}` : "";

		const joinMessage = {
			text1: `${namesText}へご登録のお願い`,
			text2: "こちらから登録をお願いします🙇",
			text3: `店舗コード：${storeCode}`,
			label: "スタッフ登録",
			uri: liffUrl.registerStaffPage,
		};
		await sendGroupFlexMessage(groupId, joinMessage);

		console.log("✅ memberJoinService executed successfully");
		return { ok: true, message: "memberJoinService executed successfully" };
	} catch (error) {
		console.error("❌ memberJoinService error:", error);
		throw new Error("memberJoinService failed");
	}
};
