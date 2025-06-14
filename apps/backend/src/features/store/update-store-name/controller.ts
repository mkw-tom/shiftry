import type {
	ErrorResponse,
	ValidationErrorResponse,
} from "@shared/common/types/errors";
import type { UpdateStoreNameResponse } from "@shared/store/types/update-store-name";
import { updateStoreNameValidate } from "@shared/store/validations/update-store-name";
import type { Request, Response } from "express";
import { updateStoreName } from "../../../repositories/store.repository";
import { verifyUserStoreForOwnerAndManager } from "../../common/authorization.service";

const updateStoreNameControler = async (
	req: Request,
	res: Response<
		UpdateStoreNameResponse | ErrorResponse | ValidationErrorResponse
	>,
): Promise<void> => {
	try {
		const userId = req.userId as string;
		const storeId = req.storeId as string;
		await verifyUserStoreForOwnerAndManager(userId, storeId);

		const parsed = updateStoreNameValidate.safeParse(req.body);
		if (!parsed.success) {
			res.status(400).json({
				ok: false,
				message: "Invalid request",
				errors: parsed.error.errors,
			});
			return;
		}
		const updateName = parsed.data.name;
		const store = await updateStoreName(storeId, updateName);

		res.status(200).json({ ok: true, store });
	} catch (error) {
		console.error(error);
		res.status(500).json({ ok: false, message: "Internal Server Error" });
	}
};

export default updateStoreNameControler;
