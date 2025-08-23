import type { ErrorResponse } from "@shared/api/common/types/errors.js";
import type { GetMemberFromStoreResponse } from "@shared/api/user/types/get-member.js";
import type { Request, Response } from "express";
import {
	getMemberFromStore,
	getUserStoreByUserIdAndStoreId,
} from "../../../repositories/userStore.repository.js";

const getMemberFromStoreController = async (
	req: Request,
	res: Response<GetMemberFromStoreResponse | ErrorResponse>,
): Promise<void> => {
	try {
		const auth = req.auth;
		if (!auth || !auth.uid || !auth.sid) {
			return void res.status(401).json({ ok: false, message: "Unauthorized" });
		}

		const existing = await getUserStoreByUserIdAndStoreId(auth.uid, auth.sid);
		if (!existing) {
			return void res
				.status(404)
				.json({ ok: false, message: "User store not found" });
		}

		const members = await getMemberFromStore(auth.sid);
		if (!members || members.length === 0) {
			return void res
				.status(404)
				.json({ ok: false, message: "No users found in the store" });
		}

		res.status(200).json({ ok: true, members: members });
	} catch (error) {
		console.error("Error in getStoreUsersController:", error);
		res.status(500).json({ ok: false, message: "Failed to get store users" });
	}
};

export default getMemberFromStoreController;
