import type {
	ErrorResponse,
	ValidationErrorResponse,
} from "@shared/api/common/types/errors.js";
import type { UpsertAssigShiftResponse } from "@shared/api/shift/assign/types/put.js";
import { upsertAssignShfitValidate } from "@shared/api/shift/assign/validations/put.js";
import type { Request, Response } from "express";
import { upsertAssignShfit } from "../../../../repositories/assingShift.repostory.js";
import { verifyUserStoreForOwnerAndManager } from "../../../common/authorization.service.js";

const upsertAssignShfitController = async (
	req: Request,
	res: Response<
		UpsertAssigShiftResponse | ValidationErrorResponse | ErrorResponse
	>,
): Promise<void> => {
	try {
		const userId = req.userId as string;
		const storeId = req.storeId as string;
		await verifyUserStoreForOwnerAndManager(userId, storeId);

		const parsed = upsertAssignShfitValidate.safeParse(req.body);
		if (!parsed.success) {
			res.status(400).json({
				ok: false,
				message: "Invalid request value",
				errors: parsed.error.errors,
			});
			return;
		}

		const assignShift = await upsertAssignShfit(storeId, parsed.data);
		if (!assignShift) {
			res.status(404).json({ ok: false, message: "assignShfit is not found" });
			return;
		}
		res.json({ ok: true, assignShift });
	} catch (error) {
		console.error("Failed to upsert assign shift:", error);
		res.status(500).json({ ok: false, message: "Internal Server Error" });
	}
};

export default upsertAssignShfitController;
