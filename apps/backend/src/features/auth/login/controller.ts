import type { LoginControllerResponse } from "@shared/api/auth/types/login.js";
import type { ErrorResponse } from "@shared/api/common/types/errors.js";
import type { Request, Response } from "express";
import { signAppJwt } from "../../../utils/jwt.js";
import { loginService } from "./service.js";

export const loginController = async (
	req: Request,
	res: Response<LoginControllerResponse | ErrorResponse>,
): Promise<void> => {
	try {
		const auth = req.auth;

		if (!auth?.uid) {
			res
				.status(401)
				.json({ ok: false, code: "UNAUTHORIZED", message: "Unauthorized" });
			return;
		}

		const loginRes = await loginService(auth.uid, auth.sid ?? null);
		if (!loginRes) {
			res.status(500).json({
				ok: false,
				code: "UNKNOWN",
				message: "login service returned empty",
			});
			return;
		}

		switch (loginRes.kind) {
			case "UNREGISTERED":
				res.status(200).json({
					ok: false,
					code: "UNREGISTERED",
					message: "User is not registered",
				});
				return;

			case "NO_STORES":
				res.status(200).json({
					ok: false,
					code: "NO_STORES",
					message: "No stores found for user",
				});
				return;

			case "STORE_FORBIDDEN":
				res.status(403).json({
					ok: false,
					code: "STORE_FORBIDDEN",
					message: "Store access forbidden",
				});
				return;

			case "SELECT_STORE":
				res.status(200).json({
					ok: true,
					kind: "SELECT_STORE",
					user: loginRes.user,
					stores: loginRes.stores,
				});
				return;

			case "AUTO": {
				const needsSidFix = !auth.sid || auth.sid !== loginRes.store.id;
				if (needsSidFix) {
					const access = signAppJwt({
						uid: loginRes.user.id,
						sid: loginRes.store.id,
						role: loginRes.role, // ※roleはUIヒント。認可はDBで
					});

					res.status(200).json({
						ok: true,
						kind: "AUTO",
						user: loginRes.user,
						store: loginRes.store,
						role: loginRes.role,
						session: { access }, // ← ここだけ同梱
					});
					return;
				}

				// 再発行不要
				res.status(200).json({
					ok: true,
					kind: "AUTO",
					user: loginRes.user,
					store: loginRes.store,
					role: loginRes.role,
				});
				return;
			}
		}
	} catch (error) {
		console.error("Error in loginController:", error);
		res
			.status(500)
			.json({ ok: false, code: "SERVER_ERROR", message: "failed to login" });
	}
};
