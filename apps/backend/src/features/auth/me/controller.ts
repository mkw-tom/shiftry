import type { AuthMeResponse } from "@shared/api/auth/types/me.js";
import type { ErrorResponse } from "@shared/api/common/types/errors.js";
import type { Request, Response } from "express";
import { AuthMeService } from "./service.js";

const AuthMeController = async (
	req: Request,
	res: Response<AuthMeResponse | ErrorResponse>,
): Promise<void> => {
	try {
		const auth = req.auth;

		if (!auth?.uid || !auth?.sid || !auth?.role) {
			return void res.status(401).json({ ok: false, message: "Unauthorized" });
		}

		const response = await AuthMeService(auth.uid, auth.sid);
		if (!response.ok) {
			const code =
				response.message === "Forbidden"
					? 403
					: response.message?.includes("not found")
						? 404
						: 400;
			return void res.status(code).json(response);
		}

		res.status(200).json(response);
	} catch (error) {
		console.error("Error in AuthMeController:", error);
		res.status(500).json({ ok: false, message: "Internal Server Error" });
	}
};

export default AuthMeController;
