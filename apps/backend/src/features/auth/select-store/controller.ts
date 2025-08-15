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
		if (!req.auth?.uid) {
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
		res.setHeader("Cache-Control", "no-store");

		const result = await selectStoreLoginService(req.auth.uid, storeId);
		if (!result.ok) {
			const status = result.code === "STORE_FORBIDDEN" ? 403 : 404;
			res.status(status).json(result);
			return;
		}

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
