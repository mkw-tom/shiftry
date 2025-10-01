import type { ErrorResponse } from "@shared/api/common/types/errors.js";
import type { LineMessageAPIResponse } from "@shared/api/webhook/line/types.js";
import type { ConfirmShiftMessageType } from "@shared/api/webhook/line/validatioins.js";
import { MDW, YMDHM } from "@shared/utils/formatDate.js";
import { aes, liffUrl } from "../../../../lib/env.js";
import { getStoreByIdAllData } from "../../../../repositories/store.repository.js";
import { decryptText } from "../../../../utils/aes.js";
import { verifyUserStoreForOwnerAndManager } from "../../../common/authorization.service.js";
import { sendGroupFlexMessage } from "../service.js";

export const sendConfirmedShiftService = async (
	uid: string,
	sid: string,
	body: ConfirmShiftMessageType,
): Promise<LineMessageAPIResponse | ErrorResponse> => {
	const { shiftRequestId, startDate, endDate } = body;

	await verifyUserStoreForOwnerAndManager(uid, sid);

	const store = await getStoreByIdAllData(sid);
	if (!store) {
		return { ok: false, message: "Store or UserStore not found" };
	}

	const groupId_enc = store.groupId_enc;
	if (!groupId_enc) {
		return { ok: false, message: "Store is not linked with LINE group" };
	}
	const groupId = decryptText(groupId_enc, {
		[aes.keyVersionGroupId]: aes.keyGroupId,
	});

	await sendGroupFlexMessage(groupId, {
		text1: "シフトが出来上がりました！",
		text2: "以下のボタンからシフト確認をお願いします！",
		text3: `期間：${MDW(new Date(startDate))} 〜 ${MDW(new Date(endDate))}`,
		label: "シフト確認",
		uri: `${liffUrl.showConfirmShiftPage}?shiftRequestId=${shiftRequestId}`,
	});

	return { ok: true, message: "Message sent successfully" };
};
