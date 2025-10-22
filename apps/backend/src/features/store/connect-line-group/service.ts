import type { ErrorResponse } from "@shared/api/common/types/errors.js";
import type { StoreConnectLineGroupResponse } from "@shared/api/store/types/connect-line-group.js";
import prisma from "../../../config/database.js";
import { aes, hmac } from "../../../lib/env.js";
import {
	deleteLineStagingGroupById,
	getLineStagingGroupByHash,
} from "../../../repositories/lineStagingGroup.js";
import {
	connectStoreToGroup,
	findStoreByGroupHashExcept,
	getStoreByIdAllData,
} from "../../../repositories/store.repository.js";
import { getStoreCodeByHash } from "../../../repositories/storeCode.repository.js";
import {
	getUserByLineIdHash,
	upsertUser,
} from "../../../repositories/user.repository.js";
import {
	createUserStore,
	getUserStoreByUserIdAndStoreId,
} from "../../../repositories/userStore.repository.js";
import { encryptText } from "../../../utils/aes.js";
import { hmacSha256 } from "../../../utils/hmac.js";
import { verifyIdToken } from "../../common/liff.service.js";

export async function connectStoreToGroupService(
	idToken: string,
	groupId: string,
	storeCode: string,
): Promise<StoreConnectLineGroupResponse | ErrorResponse> {
	const lineSub = await verifyIdToken(idToken);
	if (!lineSub) {
		throw {
			status: 401,
			message: "Invalid or missing ID token",
		};
	}
	const lineId_hash = hmacSha256(lineSub, hmac.saltLineId);
	const user = await getUserByLineIdHash(lineId_hash);
	if (!user) {
		return { ok: false, message: "User not found" };
	}

	const storeCode_hash = hmacSha256(storeCode, hmac.saltStoreCode);
	const storeCodeRes = await getStoreCodeByHash(storeCode_hash);
	if (!storeCodeRes) {
		return { ok: false, message: "storeCode not found" };
	}

	const userStore = await getUserStoreByUserIdAndStoreId(
		user.id,
		storeCodeRes.storeId,
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
	const already = await findStoreByGroupHashExcept(
		groupId_hash,
		storeCodeRes.storeId,
	);
	if (already) {
		return {
			ok: false,
			message: "This group is already linked to another store",
		};
	}

	const currentStore = await getStoreByIdAllData(storeCodeRes.storeId);
	if (!currentStore) {
		return { ok: false, message: "Store not found" };
	}
	if (currentStore.groupId_hash) {
		if (currentStore.groupId_hash === groupId_hash) {
			return { ok: true, store: currentStore, kind: "ALREADY_LINKED" };
		}
		return {
			ok: false,
			message: "This store is already linked to another group",
		};
	}

	const store = await connectStoreToGroup(
		storeCodeRes.storeId,
		groupId_hash,
		groupId_enc,
		hmac.keyVersionGroupId,
		aes.keyVersionGroupId,
	);

	const stagingData = await getLineStagingGroupByHash(groupId_hash);

	if (stagingData?.groupId_hash === groupId_hash) {
		stagingData.members.map((member) => {
			prisma.$transaction(async (tx) => {
				const user = await upsertUser(
					{
						name: member.name,
						pictureUrl: member.pictureUrl ?? "",
						lineId_hash: member.lineId_hash as string,
						lineId_enc: member.lineId_enc as string,
						lineKeyVersion_hash: hmac.keyVersionLineId,
						lineKeyVersion_enc: aes.keyVersionLineId,
					},
					tx,
				);

				await createUserStore(user.id, store.id, "STAFF", tx);

				await deleteLineStagingGroupById(stagingData.id, tx);
			});
		});
	}

	return { ok: true, store: store, kind: "LINKED" };
}
