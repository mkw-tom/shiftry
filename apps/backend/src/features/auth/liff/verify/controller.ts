import type { ErrorResponse } from "@shared/api/common/types/errors.js";
import type { VerifyLiffUserResponse } from "@shared/api/liff/types/verify.js";
import type { Request, Response } from "express";
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

		const lineSub = await verifyIdToken(idToken);
		await assertChannelValid(channel.type, channel?.id ?? null);

		const existing = await findUserByLineSub(lineSub);
		const linkedStoreId =
			channel?.type !== "utou" && channel?.id
				? await findLinkedStoreIdByChannelId(channel?.id)
				: undefined;

		const token = signAppJwt({ uid: existing?.id, sid: linkedStoreId });

		res.json({
			token,
			user: existing ? { id: existing.id } : null,
			flags: {
				existingUser: !!existing,
				channelLinked: !!linkedStoreId,
				storeId: linkedStoreId,
			},
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
