import type {
	RegisterOwnerResponse,
	UpsertUserInput,
} from "@shared/api/auth/types/register-owner.js";
import type { StoreNameType } from "@shared/api/auth/validations/register-owner.js";
import type { ErrorResponse } from "@shared/api/common/types/errors.js";
import prisma from "../../../../config/database.js";
import { aes, hmac, lineMessageChannel } from "../../../../lib/env.js";
import { createStaffPreference } from "../../../../repositories/staffPreference.js";
import { createStore } from "../../../../repositories/store.repository.js";
import { UpsertStoreCode } from "../../../../repositories/storeCode.repository.js";
import { upsertUser } from "../../../../repositories/user.repository.js";
import { createUserStore } from "../../../../repositories/userStore.repository.js";
import { encryptText } from "../../../../utils/aes.js";
import { hmacSha256 } from "../../../../utils/hmac.js";
import { generateStoreCode } from "../../../../utils/storeCode.js";
import { verifyIdToken } from "../../../common/liff.service.js";
import { pushToUser } from "./pushMessageToOwner.js";

const registerOwnerService = async (
	idToken: string,
	userInput: UpsertUserInput,
	storeInput: StoreNameType,
): Promise<RegisterOwnerResponse | ErrorResponse> => {
	const lineSub = await verifyIdToken(idToken);
	const lineId_hash = hmacSha256(lineSub, hmac.saltLineId);
	const lineId_enc = encryptText(lineSub, aes.keyLineId, aes.keyVersionLineId);

	const { user, store, userStore } = await prisma.$transaction(async (tx) => {
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

		const staffPreference = await createStaffPreference(
			{
				storeId: store.id,
				userId: user.id,
				weekMax: 0,
				weekMin: 0,
				note: "",
				weeklyAvailability: {},
			},
			tx,
		);
		return { user, store, userStore, staffPreference };
	});

	const codePlain = generateStoreCode();
	const code_hash = hmacSha256(codePlain, hmac.saltStoreCode);
	const code_enc = encryptText(
		codePlain,
		aes.keyStoreCode,
		aes.keyVersionStoreCode,
	);

	const storecode = await UpsertStoreCode(store.id, code_hash, code_enc);
	if (!storecode) {
		throw new Error("failed to save storeCode");
	}

	try {
		const text = [
			"登録が完了しました✨",
			`店舗名：${store.name}`,
			`店舗コード：${codePlain}`,
			"",
			"店舗コードはLINE連携・スタッフ登録に使用しますので、控えておくようお願いいたします。",
		].join("\n");
		await pushToUser(lineSub, text);
	} catch (e) {
		console.error("[registerOwner] storecode/push failed:", e);
		return { ok: false, message: "Failed to send LINE push message" };
	}

	return {
		ok: true,
		user,
		store,
		userStore,
		savedStoreCode: true,
	};
};

export default registerOwnerService;
