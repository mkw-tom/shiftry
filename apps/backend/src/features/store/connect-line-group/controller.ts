import type { ErrorResponse } from "@shared/api/common/types/errors";
import type { StoreConnectLineGroupResponse } from "@shared/api/store/types/connect-line-group";
import type { Request, Response } from "express";
import { updateStoreGroupId } from "../../../repositories/store.repository";
import { getUserById } from "../../../repositories/user.repository";
import { generateJWT } from "../../../utils/JWT/jwt";
import { verifyUserStoreForOwner } from "../../common/authorization.service";

const storeConnectLineGroupController = async (
	req: Request,
	res: Response<StoreConnectLineGroupResponse | ErrorResponse>,
): Promise<void> => {
	try {
		const userId = req.userId as string;
		const storeId = req.storeId as string;
		const groupId = req.groupId as string;
		await verifyUserStoreForOwner(userId, storeId);

		const user = await getUserById(userId);
		if (!user) {
			res.status(404).json({ ok: false, message: "user is not found" });
			return;
		}

		const store = await updateStoreGroupId(storeId, groupId);
		const group_token = generateJWT({ groupId: groupId });

		res.json({ ok: true, store, group_token });
	} catch (error) {
		console.error(error);
		res.status(500).json({ ok: false, message: "Internal Server Error" });
	}
};

export default storeConnectLineGroupController;
