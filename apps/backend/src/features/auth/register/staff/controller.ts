// import type { Request, Response } from "express";

// import type { RegisterStaffResponse } from "@shared/api/auth/types/register-staff.js";
// import { userInputValidate } from "@shared/api/auth/validations/register-staff.js";
// import type {
// 	ErrorResponse,
// 	ValidationErrorResponse,
// } from "@shared/api/common/types/errors.js";
// import registerStaffService from "./service.js";

// const registerStaffController = async (
// 	req: Request,
// 	res: Response<
// 		RegisterStaffResponse | ErrorResponse | ValidationErrorResponse
// 	>,
// ): Promise<void> => {
// 	try {
// 		const idToken = req.idToken;

// 		if (!idToken) {
// 			return void res
// 				.status(401)
// 				.json({ ok: false, message: "Missing X-Id-Token" });
// 		}

// 		const userInputParsed = userInputValidate.safeParse(req.body.userInput);
// 		if (!userInputParsed.success) {
// 			res.status(400).json({
// 				ok: false,
// 				message: "Invalid request",
// 				errors: userInputParsed.error.errors,
// 			});
// 			return;
// 		}

// 		const { user, store, userStore } = await registerStaffService(
// 			idToken,
// 			userInputParsed.data,
// 		);

// 		res.json({
// 			ok: true,
// 			user,
// 			store,
// 			userStore,
// 		});
// 	} catch (error) {
// 		console.error("Error in registerStaffController:", error);
// 		res.status(500).json({ ok: false, message: "failed to register staff" });
// 	}
// };

// export default registerStaffController;
