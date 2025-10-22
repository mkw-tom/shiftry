import type {
	ErrorResponse,
	ValidationErrorResponse,
} from "@shared/api/common/types/errors.js";
import type { UpdateBulkStaffPreferenceResponse } from "@shared/api/staffPreference/types/update_bulk.js";
import { updateBulkStaffPreferenceValidation } from "@shared/api/staffPreference/validations/update_bulk.js";
import type { Request, Response } from "express";
import { bulkUpdateStaffPreference } from "../../../repositories/staffPreference.js";

export const updateBulkStaffPreferenceController = async (
	req: Request,
	res: Response<
		UpdateBulkStaffPreferenceResponse | ErrorResponse | ValidationErrorResponse
	>,
): Promise<void> => {
	try {
		const auth = req.auth;
		if (!auth?.uid || !auth?.sid) {
			return void res.status(401).json({ ok: false, message: "Unauthorized" });
		}
		const storeId = auth.sid;

		const parsed = updateBulkStaffPreferenceValidation.safeParse(req.body);
		if (!parsed.success) {
			return void res.status(400).json({
				ok: false,
				message: "invalid request value",
				errors: parsed.error.errors,
			});
		}

		const data = parsed.data;

		const BatchPayload = await bulkUpdateStaffPreference(storeId, data);

		return void res.status(200).json({
			ok: true,
			count: BatchPayload.count,
		});
	} catch (error) {
		console.error("Error in getStaffPreferencesController:", error);
		res.status(500).json({ ok: false, message: "Internal Server Error" });
	}
};
