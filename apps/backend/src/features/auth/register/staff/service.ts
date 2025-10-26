import type { UpsertUserInput } from "@shared/api/auth/types/register-owner.js";
import type { RegisterStaffResponse } from "@shared/api/auth/types/register-staff.js";
import type { ErrorResponse } from "@shared/api/common/types/errors.js";
import prisma from "../../../../config/database.js";
import { aes, hmac } from "../../../../lib/env.js";
import { createStaffPreference } from "../../../../repositories/staffPreference.js";
import { getStoreCodeByHash } from "../../../../repositories/storeCode.repository.js";
import { upsertUser } from "../../../../repositories/user.repository.js";
import { getUserStoreByUserIdAndStoreId } from "../../../../repositories/userStore.repository.js";
import { encryptText } from "../../../../utils/aes.js";
import { hmacSha256 } from "../../../../utils/hmac.js";
import { verifyIdToken } from "../../../common/liff.service.js";
const registerStaffService = async (
	idToken: string,
	userInput: UpsertUserInput,
	storeCode: string,
): Promise<RegisterStaffResponse | ErrorResponse> => {
	const codeHash = hmacSha256(storeCode, hmac.saltStoreCode);
	const code = await getStoreCodeByHash(codeHash);
	if (!code) return { ok: false, message: "storeCode not found" };

	const sub = await verifyIdToken(idToken);
	if (!sub) return { ok: false, message: "Invalid or missing ID token" };

	const lineHash = hmacSha256(sub, hmac.saltLineId);
	const lineEnc = encryptText(sub, aes.keyLineId, aes.keyVersionLineId);

	try {
		return await prisma.$transaction(async (tx) => {
			const user = await upsertUser(
				{
					name: userInput.name,
					pictureUrl: userInput.pictureUrl,
					lineId_hash: lineHash,
					lineId_enc: lineEnc,
					lineKeyVersion_hash: hmac.keyVersionLineId,
					lineKeyVersion_enc: aes.keyVersionLineId,
				},
				tx,
			);

			// 既存チェック（主キー）
			const existing = await getUserStoreByUserIdAndStoreId(
				user.id,
				code.storeId,
				tx,
			);
			if (existing) {
				return {
					ok: true,
					user,
					store: existing.store,
					userStore: existing,
					kind: "ALREADY_MEMBER",
				};
			}

			const created = await tx.userStore.create({
				data: { userId: user.id, storeId: code.storeId, role: "STAFF" },
				include: {
					store: { select: { id: true, name: true, isActive: true } },
				},
			});

			const staffPreference = await createStaffPreference(
				{
					storeId: code.storeId,
					userId: user.id,
					weekMax: 0,
					weekMin: 0,
					note: "",
					weeklyAvailability: {},
				},
				tx,
			);

			return {
				ok: true,
				user,
				store: created.store,
				userStore: created,
				kind: "NEW_MEMBER",
			};
		});
	} catch (e) {
		console.error("[registerStaff] tx failed:", e);
		return { ok: false, message: "Failed to register staff" };
	}
};

export default registerStaffService;
