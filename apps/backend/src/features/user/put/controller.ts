import type {
	ErrorResponse,
	ValidationErrorResponse,
} from "@shared/api/common/types/errors.js";
import type { UpdateUserProfileResponse } from "@shared/api/user/types/put.js";
import { updateUserProlfileValidate } from "@shared/api/user/validations/put.js";
import type { Request, Response } from "express";
import { updateUser } from "../../../repositories/user.repository.js";
import { verifyUser } from "../../common/authorization.service.js";

const updateUserProfileController = async (
	req: Request,
	res: Response<
		UpdateUserProfileResponse | ValidationErrorResponse | ErrorResponse
	>,
): Promise<void> => {
	try {
		const userId = req.userId as string;
		await verifyUser(userId);

		const parsed = updateUserProlfileValidate.safeParse(req.body);
		if (!parsed.success) {
			res.status(400).json({
				ok: false,
				message: "Invalid request",
				errors: parsed.error.errors,
			});
			return;
		}
		const updatedData = parsed.data;
		const updatedUser = await updateUser(userId, updatedData);

		res.status(200).json({ ok: true, updatedUser });
	} catch (error) {
		console.error("Error in updateUser:", error);
		res.status(500).json({ ok: false, message: "Failed to update user" });
	}
};

export default updateUserProfileController;
