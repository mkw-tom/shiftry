import type { ErrorResponse } from "@shared/api/common/types/errors.js";
import type { DeleteUserByOwnerResponse } from "@shared/api/user/types/delete-by-user-id.js";
import type { Request, Response } from "express";
import { deleteUser } from "../../../repositories/user.repository.js";
import { verifyUserForOwner } from "../../common/authorization.service.js";

const deleteUserByOwnerController = async (
	req: Request,
	res: Response<DeleteUserByOwnerResponse | ErrorResponse>,
): Promise<void> => {
	try {
		const userId = req.userId as string;
		await verifyUserForOwner(userId);
		const deleteStaffId = req.params.userId;

		const deleteStaff = await deleteUser(deleteStaffId);

		res.status(200).json({ ok: true, deleteStaff });
	} catch (error) {
		console.error("Error in deleteUser:", error);
		res.status(500).json({ ok: false, message: "Failed to delete user" });
	}
};

export default deleteUserByOwnerController;
