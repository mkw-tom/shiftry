import type { AssignShiftDTO } from "@shared/api/shift/assign/dto.js";
import type {
	ShiftsOfAssignType,
	UpsertAssignShfitInput,
} from "@shared/api/shift/assign/validations/put.js";
import type { NotificationConfirmShiftResponse } from "@shared/api/shift/notification/confirm/type.js";
import type { ShiftRequestDTO } from "@shared/api/shift/request/dto.js";
import type {
	RequestsType,
	UpsertShiftRequetType,
} from "@shared/api/shift/request/validations/put.js";
import { MDW } from "@shared/utils/formatDate.js";
import prisma from "../../../../config/database.js";
import { aes, liffUrl } from "../../../../lib/env.js";
import { upsertAssignShfit } from "../../../../repositories/assingShift.repostory.js";
import { upsertShiftRequest } from "../../../../repositories/shiftRequest.repository.js";
import { getStoreByIdAllData } from "../../../../repositories/store.repository.js";
import { decryptText } from "../../../../utils/aes.js";
import { sendGroupFlexMessage } from "../../../webhook/line/service.js";

export const notificationConfirmedShiftUsecase = async ({
	sid,
	upsertShiftReqeustData,
	upsertAssignShiftData,
}: {
	sid: string;
	upsertShiftReqeustData: UpsertShiftRequetType;
	upsertAssignShiftData: UpsertAssignShfitInput;
}): Promise<NotificationConfirmShiftResponse> => {
	try {
		const result = await prisma.$transaction(async (tx) => {
			const shiftRequestRaw = await upsertShiftRequest(
				sid,
				upsertShiftReqeustData,
			);
			if (!shiftRequestRaw) {
				throw new Error("Shift request upsert failed");
			}
			const assignShiftRaw = await upsertAssignShfit(
				sid,
				upsertAssignShiftData,
			);

			if (!assignShiftRaw) {
				throw new Error("Assign shift upsert failed");
			}
			const store = await getStoreByIdAllData(sid);
			if (!store) {
				throw new Error("Store or UserStore not found");
			}

			const groupId_enc = store.groupId_enc;
			if (!groupId_enc) {
				throw new Error("Store is not linked with LINE group");
			}
			const groupId = decryptText(groupId_enc, {
				[aes.keyVersionGroupId]: aes.keyGroupId,
			});

			await sendGroupFlexMessage(groupId, {
				text1: "シフトが出来上がりました！",
				text2: "以下のボタンからシフト確認をお願いします！",
				text3: `期間：${MDW(new Date(shiftRequestRaw.weekStart))} 〜 ${MDW(
					new Date(shiftRequestRaw.weekEnd),
				)}`,
				label: "シフト確認",
				uri: `${liffUrl.showConfirmShiftPage}?shiftRequestId=${shiftRequestRaw.id}`,
			});

			const shiftRequest: ShiftRequestDTO = {
				...shiftRequestRaw,
				requests: shiftRequestRaw.requests as RequestsType,
			};
			const assignShift: AssignShiftDTO = {
				...assignShiftRaw,
				shifts: assignShiftRaw.shifts as ShiftsOfAssignType,
			};

			return { shiftRequest, assignShift };
		});

		if (!result || !result.shiftRequest || !result.assignShift) {
			throw new Error("Failed to upsert shift request or assign shift");
		}

		return {
			ok: true,
			message: "Message sent successfully",
			shiftRequest: result.shiftRequest,
			assignShift: result.assignShift,
		};
	} catch (error) {
		console.error("Error in notificationConfirmedShiftUseCase:", error);
		throw error;
	}
};
