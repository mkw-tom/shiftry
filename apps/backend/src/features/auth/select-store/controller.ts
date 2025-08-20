import type { SelectStoreResponse } from "@shared/api/auth/types/select-store.js";
import { storeIdValidate } from "@shared/api/auth/validations/init.js";
import type {
	ErrorResponse,
	ValidationErrorResponse,
} from "@shared/api/common/types/errors.js";
// modules/auth/controllers/select-store.controller.ts
import type { Request, Response } from "express";
import { selectStoreLoginService } from "./service.js";

const selectStoreLoginController = async (
	req: Request,
	res: Response<SelectStoreResponse | ErrorResponse | ValidationErrorResponse>,
): Promise<void> => {
	try {
		const auth = req.auth;

		if (!auth?.uid) {
			res.status(401).json({ ok: false, message: "Unauthorized" });
			return;
		}
		const parsed = storeIdValidate.safeParse(req.body);
		if (!parsed.success) {
			res.status(400).json({
				ok: false,
				message: "Invalid store ID",
				errors: parsed.error.errors,
			});
			return;
		}

		const { storeId } = parsed.data;

		const result = await selectStoreLoginService(auth.uid, storeId);

		if (!result.ok && result.message === "forbidden")
			return void res.status(403).json(result);

		if (!result.ok && result.message === "not found")
			return void res.status(404).json(result);

		res.status(200).json(result);
	} catch (e) {
		console.error("[select-store] error", e);
		res.status(500).json({
			ok: false,
			message: "Internal server error",
		});
	}
};

export default selectStoreLoginController;
