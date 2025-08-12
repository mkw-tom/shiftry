import type {
	RegisterOwnerServiceResponse,
	UpsertUserInput,
} from "@shared/api/auth/types/register-owner";
import type { RegisterStaffServiceResponse } from "@shared/api/auth/types/register-staff";
import type { StoreNameType } from "@shared/api/auth/validations/register-owner";
import prisma from "../../../../config/database";
import { aes, hmac } from "../../../../lib/env";
import {
	createStore,
	getStoreByGroupId,
	getStoreByGroupIdHash,
} from "../../../../repositories/store.repository";
import { upsertUser } from "../../../../repositories/user.repository";
import { createUserStore } from "../../../../repositories/userStore.repository";
import { encryptText } from "../../../../utils/aes";
import { hmacSha256 } from "../../../../utils/hmac";
import {
	assertChannelValid,
	verifyIdToken,
} from "../../../common/liff.service";

const registerStaffService = async (
	idToken: string,
	channelId: string,
	channelType: "utou" | "group" | "room",
	userInput: UpsertUserInput,
): Promise<RegisterStaffServiceResponse> => {
	if (channelType !== "group") {
		throw { status: 400, message: "Only group linking is supported" };
	}
	await assertChannelValid(channelType, channelId);
	const lineSub = await verifyIdToken(idToken);
	const lineId_hash = hmacSha256(lineSub, hmac.saltLineId);
	const lineId_enc = encryptText(lineSub, aes.keyLineId, aes.keyVersionLineId);

	const groupId_hash = hmacSha256(channelId, hmac.saltGroupId);

	return prisma.$transaction(async (tx) => {
		const user = await upsertUser(
			{
				name: userInput.name,
				pictureUrl: userInput.pictureUrl,
				lineId_hash: lineId_hash,
				lineId_enc: lineId_enc,
				lineKeyVersion_hash: hmac.keyVersionLineId,
				lineKeyVersion_enc: aes.keyVersionLineId,
			},
			tx,
		);

		const store = await getStoreByGroupIdHash(groupId_hash, tx);
		if (!store) {
			throw { status: 404, message: "Store not found for the given group" };
		}

		const userStore = await createUserStore(user.id, store.id, "STAFF", tx);

		return { user, store, userStore };
	});
};

export default registerStaffService;
