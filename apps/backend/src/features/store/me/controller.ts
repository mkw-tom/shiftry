import type { ErrorResponse } from "@shared/api/common/types/errors.js";
import type { GetStoresFromUserResponse } from "@shared/api/store/types/me.js";
import type { Request, Response } from "express";

import { getStoresFromUser } from "../../../repositories/userStore.repository.js";
import { verifyUser } from "../../common/authorization.service.js";

const getStoresFromUserController = async (
	req: Request,
	res: Response<GetStoresFromUserResponse | ErrorResponse>,
): Promise<void> => {
	try {
		const auth = req.auth;

		if (!auth || !auth.uid) {
			return void res.status(401).json({ ok: false, message: "Unauthorized" });
		}

		const stores = await getStoresFromUser(auth.uid);

		res.json({ ok: true, stores });
	} catch (error) {
		console.error(error);
		res.status(500).json({ ok: false, message: "Internal Server Error" });
	}
};

export default getStoresFromUserController;
