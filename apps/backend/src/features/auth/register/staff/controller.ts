import type { Request, Response } from "express";

import type { RegisterStaffResponse } from "@shared/api/auth/types/register-staff.js";
import { userInputValidate } from "@shared/api/auth/validations/register-staff.js";
import type {
	ErrorResponse,
	ValidationErrorResponse,
} from "@shared/api/common/types/errors.js";
import registerStaffService from "./service.js";

const registerStaffController = async (
	req: Request,
	res: Response<
		RegisterStaffResponse | ErrorResponse | ValidationErrorResponse
	>,
): Promise<void> => {
	try {
		const idToken = req.idToken;
		const storeCode = req.storeCode;

		if (!idToken) {
			return void res
				.status(401)
				.json({ ok: false, message: "Missing X-Id-Token" });
		}
		if (!storeCode) {
			return void res
				.status(400)
				.json({ ok: false, message: "Missing storeCode" });
		}

		const userInputParsed = userInputValidate.safeParse(req.body.userInput);
		if (!userInputParsed.success) {
			res.status(400).json({
				ok: false,
				message: "Invalid request userInput",
				errors: userInputParsed.error.errors,
			});
			return;
		}

		const response = await registerStaffService(
			idToken,
			userInputParsed.data,
			storeCode,
		);
		if (!response.ok) {
			const msg = response.message ?? "Bad Request";
			const status = msg.includes("Invalid or missing ID token")
				? 401
				: msg.includes("not found")
					? 404
					: msg.includes("permission")
						? 403
						: msg.includes("already")
							? 409
							: 400;
			return void res.status(status).json(response);
		}

		return void res.status(200).json(response);
	} catch (error) {
		console.error("Error in registerStaffController:", error);
		const errorMessage =
			error instanceof Error ? error.message : "Internal server error";
		res.status(500).json({ ok: false, message: errorMessage });
	}
};

export default registerStaffController;
