import type { VerifyLiffUserResponse } from "@shared/api/auth/types/liff-verify.js";
// controllers/auth/liff/verify.ts
import type { ErrorResponse } from "@shared/api/common/types/errors.js";
import type { UserRole } from "@shared/api/common/types/prisma.js";
import type { Request, Response } from "express";
import {
	getUserStoreByUserId,
	getUserStoreByUserIdAndStoreId,
} from "../../../../repositories/userStore.repository.js";
import { signAppJwt } from "../../../../utils/jwt.js";
import { verifyIdToken } from "../../../common/liff.service.js";
import { VerifyLiffUserService } from "./service.js";

const VerifyLiffUserController = async (
	req: Request,
	res: Response<VerifyLiffUserResponse | ErrorResponse>,
): Promise<void> => {
	try {
		const idToken = req.idToken;

		if (!idToken) {
			res.status(401).json({ ok: false, message: "Missing X-Id-Token" });
			return;
		}

		const response = await VerifyLiffUserService(idToken);

		res.status(200).json(response);
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
