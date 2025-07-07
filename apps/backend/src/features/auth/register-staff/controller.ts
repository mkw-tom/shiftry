import type { Request, Response } from "express";
import { generateJWT } from "../../../utils/JWT/jwt";

import type { RegisterStaffResponse } from "@shared/api/auth/types/register-staff";
import {
	storeIdandShfitReruestIdValidate,
	userInputValidate,
} from "@shared/api/auth/validations/register-staff";
import type {
	ErrorResponse,
	ValidationErrorResponse,
} from "@shared/api/common/types/errors";
import { registerStaff } from "./service";

const registerStaffController = async (
	req: Request,
	res: Response<
		RegisterStaffResponse | ErrorResponse | ValidationErrorResponse
	>,
): Promise<void> => {
	try {
		const lineId = req.lineId as string;
		const userInputParsed = userInputValidate.safeParse(req.body.userInput);
		if (!userInputParsed.success) {
			res.status(400).json({
				ok: false,
				message: "Invalid request",
				errors: userInputParsed.error.errors,
			});
			return;
		}
		const storeInputParsed = storeIdandShfitReruestIdValidate.safeParse(
			req.body.storeInput,
		);
		if (!storeInputParsed.success) {
			res.status(400).json({
				ok: false,
				message: "Invalid request",
				errors: storeInputParsed.error.errors,
			});
			return;
		}

		const userInput = { ...userInputParsed.data, lineId };
		const storeInput = storeInputParsed.data;

		const { user, store, userStore } = await registerStaff(
			userInput,
			storeInput,
		);

		const user_token = generateJWT({ userId: user.id });
		const store_token = generateJWT({ storeId: store.id });
		const group_token = generateJWT({ groupId: store.groupId as string });

		res.json({
			ok: true,
			user,
			store,
			userStore,
			user_token,
			store_token,
			group_token,
		});
	} catch (error) {
		console.error("Error in registerStaffController:", error);
		res.status(500).json({ ok: false, message: "failed to register staff" });
	}
};

export default registerStaffController;
