import type {
	ErrorResponse,
	ValidationErrorResponse,
} from "@shared/api/common/types/errors";
import type { AddManageStoreResponse } from "@shared/api/store/types/add-store";
import { storeNameValidate } from "@shared/api/store/validations/add-store";
import type { Request, Response } from "express";
import { createStore } from "../../../repositories/store.repository";
import { createUserStore } from "../../../repositories/userStore.repository";
import { generateJWT } from "../../../utils/JWT/jwt";
import { verifyUserForOwner } from "../../common/authorization.service";

const addManageStoreController = async (
	req: Request,
	res: Response<
		AddManageStoreResponse | ErrorResponse | ValidationErrorResponse
	>,
): Promise<void> => {
	try {
		const userId = req.userId as string;
		const user = await verifyUserForOwner(userId);
		const parsed = storeNameValidate.safeParse(req.body.storeInput);
		if (!parsed.success) {
			res.status(400).json({
				ok: false,
				message: "Invalid request",
				errors: parsed.error.errors,
			});
			return;
		}
		const storeName = parsed.data.name;
		const store = await createStore(storeName);
		const userStore = await createUserStore(userId, store.id, "OWNER");

		const user_token = generateJWT({ userId: user.id });
		const store_token = generateJWT({ storeId: store.id });

		res.json({ ok: true, user, store, userStore, user_token, store_token });
	} catch (error) {
		console.error(error);
		res.status(500).json({ ok: false, message: "Internal Server Error" });
	}
};

export default addManageStoreController;
