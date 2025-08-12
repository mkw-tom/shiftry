import type { ErrorResponse } from "@shared/api/common/types/errors.js";
import type { GetUsersFromStoreResponse } from "@shared/api/user/types/get.js";
import type { Request, Response } from "express";
import { getUsersFromStore } from "../../../repositories/userStore.repository.js";
import { verifyUserStore } from "../../common/authorization.service.js";

const getUsersFromStoreController = async (
	req: Request,
	res: Response<GetUsersFromStoreResponse | ErrorResponse>,
): Promise<void> => {
	try {
		const userId = req.userId as string;
		const storeId = req.storeId as string;
		await verifyUserStore(userId, storeId);

		const userStoreWithUsers = await getUsersFromStore(storeId);
		const storeUsers = userStoreWithUsers.map((userStore) => userStore.user);
		if (storeUsers.length === 0) {
			res.status(404).json({ ok: false, message: "users are not found" });
			return;
		}
		res.status(200).json({ ok: true, storeUsers });
	} catch (error) {
		console.error("Error in getStoreUsersController:", error);
		res.status(500).json({ ok: false, message: "Failed to get store users" });
	}
};

export default getUsersFromStoreController;
