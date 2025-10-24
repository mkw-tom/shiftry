import type { ErrorResponse } from "@shared/api/common/types/errors.js";
import type { LineMessageAPIResponse } from "@shared/api/webhook/line/types.js";
import { liffUrl } from "../../../lib/env.js";
import { sendGroupFlexMessage } from "../../webhook/line/service.js";

export const staffJoinMessageService = async (
	groupId: string,
	storeCode: string,
): Promise<LineMessageAPIResponse | ErrorResponse> => {
	try {
		const joinMessage = {
			text1: "スタッフの方へご登録のお願い",
			text2: "スタッフの方はこちらから店舗登録をお願いします🙇",
			text3: `店舗コード：${storeCode}`,
			label: "スタッフ登録",
			uri: liffUrl.registerStaffPage,
		};
		await sendGroupFlexMessage(groupId, joinMessage);
		return {
			ok: true,
			message: "staffJoinMessageService executed successfully",
		};
	} catch (error) {
		return { ok: false, message: "staffJoinMessageService failed" };
	}
};
