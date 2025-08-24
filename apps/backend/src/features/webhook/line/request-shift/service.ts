import type { ErrorResponse } from "@shared/api/common/types/errors.js";
import type { LineMessageAPIResponse } from "@shared/api/webhook/line/types.js";
import type { RequestShiftMessageType } from "@shared/api/webhook/line/validatioins.js";
import { MDW, YMDHM } from "@shared/utils/formatDate.js";
import { URI_DASHBOARD, aes } from "../../../../lib/env.js";
import { getStoreByIdAllData } from "../../../../repositories/store.repository.js";
import { decryptText } from "../../../../utils/aes.js";
import { sendGroupFlexMessage } from "../service.js";

export const sendShiftRequestFunService = async (
	uid: string,
	sid: string,
	body: RequestShiftMessageType,
): Promise<LineMessageAPIResponse | ErrorResponse> => {
	const { shiftRequestId, startDate, endDate, deadline } = body;

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
		text1: "シフト希望提出のお知らせ🔔",
		text2: `期間：${MDW(new Date(startDate))} 〜 ${MDW(new Date(endDate))}`,
		text3: `提出期限：${YMDHM(new Date(deadline))}`,
		label: "シフト希望提出",
		uri: `${URI_DASHBOARD}/shift/submit/${shiftRequestId}`,
	});

	return { ok: true, message: "Message sent successfully" };
};

function verifyUserStoreForOwnerAndManager(uid: string, sid: string) {
	throw new Error("Function not implemented.");
}
