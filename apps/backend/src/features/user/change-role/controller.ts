import type {
	ErrorResponse,
	ValidationErrorResponse,
} from "@shared/api/common/types/errors";
import type { ChangeUserRoleResponse } from "@shared/api/user/types/change-role";
import { changeUserRoleValidate } from "@shared/api/user/validations/change-role";
import type { Request, Response } from "express";
import { verifyUserStoreForOwnerAndManager } from "../../common/authorization.service";
import { changeUserRoleService } from "./service";

const changeUserRoleController = async (
	req: Request,
	res: Response<
		ChangeUserRoleResponse | ValidationErrorResponse | ErrorResponse
	>,
): Promise<void> => {
	try {
		const userId = req.userId as string;
		const storeId = req.storeId as string;
		await verifyUserStoreForOwnerAndManager(userId, storeId);

		const prased = changeUserRoleValidate.safeParse(req.body);
		if (!prased.success) {
			res.status(400).json({
				ok: false,
				message: "invalid request value",
				errors: prased.error.errors,
			});
			return;
		}
		const { userId: staffId, role } = prased.data;

		const { user, userStore } = await changeUserRoleService(
			staffId,
			storeId,
			role,
		);

		res.json({ ok: true, user, userStore });
	} catch (error) {
		console.error("Error in updateUser:", error);
		res.status(500).json({ ok: false, message: "Failed to update user role" });
	}
};

export default changeUserRoleController;
