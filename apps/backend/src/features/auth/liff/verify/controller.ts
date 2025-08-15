import type { VerifyLiffUserResponse } from "@shared/api/auth/types/liff-verify.js";
// controllers/auth/liff/verify.ts
import type { ErrorResponse } from "@shared/api/common/types/errors.js";
import type { UserRole } from "@shared/api/common/types/prisma.js";
import type { Request, Response } from "express";
import { getUserStoreByUserIdAndStoreId } from "../../../../repositories/userStore.repository.js";
import { signAppJwt } from "../../../../utils/jwt.js";
import {
	assertChannelValid,
	verifyIdToken,
} from "../../../common/liff.service.js";
import { findLinkedStoreIdByChannelId } from "./services/store.service.js";
import { findUserByLineSub } from "./services/user.service.js";

const VerifyLiffUserController = async (
	req: Request,
	res: Response<VerifyLiffUserResponse | ErrorResponse>,
): Promise<void> => {
	try {
		const { idToken, channel } = req;

		if (!idToken) {
			res.status(401).json({ ok: false, message: "Missing X-Id-Token" });
			return;
		}
		if (!channel) {
			res
				.status(400)
				.json({ ok: false, message: "Missing channel information" });
			return;
		}

		// 1) 検証
		const lineSub = await verifyIdToken(idToken);
		await assertChannelValid(channel.type, channel.id ?? null);

		// 2) ユーザー＆連携ストア取得（並列）
		const [existing, linkedStoreId] = await Promise.all([
			findUserByLineSub(lineSub),
			channel.type !== "utou" && channel.id
				? findLinkedStoreIdByChannelId(channel.id)
				: Promise.resolve(undefined),
		]);

		// 3) ユーザーが連携ストアのメンバーなら role を付与
		let sid: string | undefined;
		let role: UserRole | undefined;

		if (existing?.id && linkedStoreId) {
			const userStore = await getUserStoreByUserIdAndStoreId(
				existing.id,
				linkedStoreId,
			);
			if (userStore) {
				sid = userStore.storeId;
				role = userStore.role;
			}
		}

		// 4) 短命トークン（必要なら typ 付与）
		const token = signAppJwt({
			uid: existing?.id,
			sid,
			role /*, typ: "access"*/,
		});

		res.setHeader("Cache-Control", "no-store");
		res.json({
			ok: true,
			token, // 将来的に session.access に寄せてもOK
			flags: {
				existingUser: Boolean(existing),
				channelLinked: Boolean(linkedStoreId),
				storeId: linkedStoreId ?? null,
			},
			next: existing ? "LOGIN" : "REGISTER",
		});
	} catch (e) {
		if (typeof e === "object" && e !== null && "status" in e) {
			const err = e as { status: number; message: string };
			res.status(err.status).json({ ok: false, message: err.message });
		} else {
			console.error("[/auth/liff/verify] error", e);
			res.status(500).json({ ok: false, message: "Internal Server Error" });
		}
	}
};

export default VerifyLiffUserController;
