import type { ErrorResponse } from "@shared/api/common/types/errors.js";
import type { StoreConnectLineGroupResponse } from "@shared/api/store/types/connect-line-group.js";
import prisma from "../../../config/database.js";
import { aes, hmac } from "../../../lib/env.js";
import {
	connectStoreToGroup,
	findStoreByGroupHashExcept,
	getStoreByGroupIdHash,
	getStoreByIdAllData,
} from "../../../repositories/store.repository.js";
import { getStoreCodeByHash } from "../../../repositories/storeCode.repository.js";
import { getUserByLineIdHash } from "../../../repositories/user.repository.js";
import { getUserStoreByUserIdAndStoreId } from "../../../repositories/userStore.repository.js";
import { encryptText } from "../../../utils/aes.js";
import { hmacSha256 } from "../../../utils/hmac.js";
import { verifyIdToken } from "../../common/liff.service.js";

export async function connectStoreToGroupService(
	idToken: string,
	groupId: string,
	storeCode: string,
): Promise<StoreConnectLineGroupResponse | ErrorResponse> {
	try {
		return await prisma.$transaction(async (tx) => {
			const lineSub = await verifyIdToken(idToken);
			if (!lineSub) {
				throw {
					status: 401,
					message: "Invalid or missing ID token",
				};
			}
			const lineId_hash = hmacSha256(lineSub, hmac.saltLineId);
			const user = await getUserByLineIdHash(lineId_hash, tx);
			if (!user) {
				return { ok: false, message: "User not found" };
			}

			const storeCode_hash = hmacSha256(storeCode, hmac.saltStoreCode);
			const storeCodeRes = await getStoreCodeByHash(storeCode_hash, tx);
			if (!storeCodeRes) {
				return { ok: false, message: "storeCode not found" };
			}

			/// 権限チェック
			const userStore = await getUserStoreByUserIdAndStoreId(
				user.id,
				storeCodeRes.storeId,
				tx,
			);
			if (!userStore || userStore.role !== "OWNER") {
				return {
					ok: false,
					message: "User does not have permission to link this store",
				};
			}

			const groupId_hash = hmacSha256(groupId, hmac.saltGroupId);
			const groupId_enc = encryptText(
				groupId,
				aes.keyGroupId,
				aes.keyVersionGroupId,
			);

			const alreadyStore = await getStoreByGroupIdHash(groupId_hash, tx);
			if (alreadyStore) {
				return { ok: true, store: alreadyStore, kind: "ALREADY_LINKED" };
			}

			const store = await connectStoreToGroup(
				storeCodeRes.storeId,
				groupId_hash,
				groupId_enc,
				hmac.keyVersionGroupId,
				aes.keyVersionGroupId,
				tx,
			);

			return { ok: true, store: store, kind: "LINKED" };
		});
	} catch (error) {
		return {
			ok: false,
			message:
				error instanceof Error && error.message
					? error.message
					: "line group connection is failed",
		};
	}
}
