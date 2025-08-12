import type { RegisterOwnerResponse } from "@shared/api/auth/types/register-owner.js";
import {
	storeNameValidate,
	userInputValidate,
} from "@shared/api/auth/validations/register-owner.js";
import type {
	ErrorResponse,
	ValidationErrorResponse,
} from "@shared/api/common/types/errors.js";
import type { Request, Response } from "express";
import registerOwnerService from "./service.js";

const registerOwnerController = async (
	req: Request,
	res: Response<
		RegisterOwnerResponse | ErrorResponse | ValidationErrorResponse
	>,
): Promise<void> => {
	try {
		const idToken = req.idToken;

		if (!idToken) {
			return void res
				.status(401)
				.json({ ok: false, message: "Missing X-Id-Token" });
		}
		const userInputParsed = userInputValidate.safeParse(req.body.userInput);
		const storeNameParsed = storeNameValidate.safeParse(req.body.storeInput);

		if (!userInputParsed.success) {
			res.status(400).json({
				ok: false,
				message: "Invalid request body",
				errors: userInputParsed.error.errors,
			});
			return;
		}
		if (!storeNameParsed.success) {
			res.status(400).json({
				ok: false,
				message: "Invalid request body",
				errors: storeNameParsed.error.errors,
			});
			return;
		}

		const { user, store, userStore } = await registerOwnerService(
			idToken,
			userInputParsed.data,
			storeNameParsed.data,
		);
		res.status(200).json({
			ok: true,
			user,
			store,
			userStore,
		});
	} catch (error) {
		console.error("Error in registerOwnerController:", error);
		res.status(500).json({
			ok: false,
			message: "Failed to register owner",
		});
	}
};

export default registerOwnerController;
