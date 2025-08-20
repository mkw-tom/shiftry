import type { LoginResponse } from "@shared/api/auth/types/login.js";
import type { ErrorResponse } from "@shared/api/common/types/errors.js";
import type { Request, Response } from "express";
import { loginService } from "./service.js";

export const loginController = async (
	req: Request,
	res: Response<LoginResponse | ErrorResponse>,
): Promise<void> => {
	try {
		const auth = req.auth;
		if (!auth?.uid) {
			res.status(401).json({ ok: false, message: "Unauthorized" });
			return;
		}

		const loginRes = await loginService(auth.uid);
		if (!loginRes) {
			throw new Error("Login service returned no response");
		}
		res.status(200).json(loginRes);
	} catch (error) {
		console.error("Error in loginController:", error);
		res.status(500).json({ ok: false, message: "failed to login" });
	}
};
