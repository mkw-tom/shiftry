import type { InitResponse } from "@shared/api/auth/types/init.js";
import { storeIdValidate } from "@shared/api/auth/validations/init.js";
import type { ErrorResponse } from "@shared/api/common/types/errors.js";
import type { Request, Response } from "express";
import { generateJWT } from "../../../utils/JWT/jwt.js";
import Init from "./service.js";

const InitController = async (
	req: Request,
	res: Response<InitResponse | ErrorResponse>,
): Promise<void> => {
	try {
		const userId = req.userId as string;
		const { storeId } = storeIdValidate.parse(req.body);

		const { store, shiftRequests } = await Init(userId, storeId);
		// const user_token = generateJWT({ userId: user.id });
		const store_token = generateJWT({ storeId: store.id });
		const group_token = generateJWT({ groupId: store.groupId as string });
		if (!store.groupId) {
			throw new Error("groupId is missing");
		}

		res.json({
			ok: true,
			store,
			shiftRequests,
			store_token,
			group_token,
		});
	} catch (error) {
		console.error("Error in loginInitController:", error);
		res.status(500).json({ ok: false, message: "failed to login init" });
	}
};

export default InitController;
