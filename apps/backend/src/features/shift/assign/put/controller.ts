import type {
	ErrorResponse,
	ValidationErrorResponse,
} from "@shared/common/types/errors";
import type { UpsertAssigShiftResponse } from "@shared/shift/assign/types/put";
import { upsertAssignShfitValidate } from "@shared/shift/assign/validations/put";
import type { Request, Response } from "express";
import { upsertAssignShfit } from "../../../../repositories/assingShift.repostory";
import { verifyUserStoreForOwnerAndManager } from "../../../common/authorization.service";

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
