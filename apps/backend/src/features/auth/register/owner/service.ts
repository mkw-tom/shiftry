import type {
	RegisterOwnerServiceResponse,
	UpsertUserInput,
} from "@shared/api/auth/types/register-owner";
import type { StoreNameType } from "@shared/api/auth/validations/register-owner";
import prisma from "../../../../config/database";
import { aes, hmac } from "../../../../lib/env";
import { createStore } from "../../../../repositories/store.repository";
import { upsertUser } from "../../../../repositories/user.repository";
import { createUserStore } from "../../../../repositories/userStore.repository";
import { encryptText } from "../../../../utils/aes";
import { hmacSha256 } from "../../../../utils/hmac";
import { verifyIdToken } from "../../../common/liff.service";

const registerOwnerService = async (
	idToken: string,
	userInput: UpsertUserInput,
	storeInput: StoreNameType,
): Promise<RegisterOwnerServiceResponse> => {
	const lineSub = await verifyIdToken(idToken);
	const lineId_hash = hmacSha256(lineSub, hmac.saltLineId);
	const lineId_enc = encryptText(lineSub, aes.keyLineId, aes.keyVersionLineId);

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

		const store = await createStore(storeInput.name, tx);

		const userStore = await createUserStore(user.id, store.id, "OWNER", tx);

		return { user, store, userStore };
	});
};

export default registerOwnerService;
