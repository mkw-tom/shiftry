import type { VerifyLiffUserResponse } from "@shared/api/auth/types/liff-verify.js";
import prisma from "../../../../config/database.js";
import { hmac } from "../../../../lib/env.js";
import { getUserByLineIdHash } from "../../../../repositories/user.repository.js";
import { getUserStoresByLineIdHash } from "../../../../repositories/userStore.repository.js";
import { hmacSha256 } from "../../../../utils/hmac.js";
import { signAppJwt } from "../../../../utils/jwt.js";
import { verifyIdToken } from "../../../common/liff.service.js";

export async function VerifyLiffUserService(
	idToken: string,
): Promise<VerifyLiffUserResponse> {
	const lineSub = await verifyIdToken(idToken);
	if (!lineSub) {
		throw { status: 401, message: "Invalid ID Token" };
	}

	const userHash = hmacSha256(lineSub, hmac.saltLineId);
	const user = await getUserByLineIdHash(userHash);
	if (!user) {
		return { ok: true, token: null, next: "REGISTER" };
	}

	const token = signAppJwt({
		uid: user?.id,
	});

	return { ok: true, token, next: "LOGIN" };
}
