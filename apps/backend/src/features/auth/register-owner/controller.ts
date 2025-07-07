import type { RegisterOwnerResponse } from "@shared/api/auth/types/register-owner";
import {
	storeNameValidate,
	userInputValidate,
} from "@shared/api/auth/validations/register-owner";
import type {
	ErrorResponse,
	ValidationErrorResponse,
} from "@shared/api/common/types/errors";
import type { Request, Response } from "express";
import { generateJWT } from "../../../utils/JWT/jwt";
import registerOwner from "./service";

const registerOwnerController = async (
	req: Request,
	res: Response<
		RegisterOwnerResponse | ErrorResponse | ValidationErrorResponse
	>,
): Promise<void> => {
	try {
		const lineId = req.lineId as string;

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

		const { userInput, storeInput } = {
			userInput: { ...userInputParsed.data, lineId },
			storeInput: storeNameParsed.data,
		};

		const { user, store, userStore } = await registerOwner(
			userInput,
			storeInput,
		);

		const user_token = generateJWT({ userId: user.id });
		const store_token = generateJWT({ storeId: store.id });

		res.status(200).json({
			ok: true,
			user,
			store,
			userStore,
			user_token,
			store_token,
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
