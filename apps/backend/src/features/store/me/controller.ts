import type { ErrorResponse } from "@shared/api/common/types/errors.js";
import type { GetStoresFromUserResponse } from "@shared/api/store/types/me.js";
import type { Request, Response } from "express";
import { getStoreFromUser } from "../../../repositories/userStore.repository.js";
import { verifyUser } from "../../common/authorization.service.js";

const getStoresFromUserController = async (
	req: Request,
	res: Response<GetStoresFromUserResponse | ErrorResponse>,
): Promise<void> => {
	try {
		const userId = req.userId as string;
		await verifyUser(userId);

		const userStores = await getStoreFromUser(userId);
		const stores = userStores.map((userstore) => userstore.store);
		if (stores.length === 0) {
			res.status(404).json({
				ok: false,
				message: "The store to which the user belongs is not found ",
			});
			return;
		}

		res.json({ ok: true, stores });
	} catch (error) {
		console.error(error);
		res.status(500).json({ ok: false, message: "Internal Server Error" });
	}
};

export default getStoresFromUserController;
