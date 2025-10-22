import type {
	ErrorResponse,
	ValidationErrorResponse,
} from "@shared/api/common/types/errors.js";
import type { CrateBulkStaffPreferencesResponse } from "@shared/api/staffPreference/types/create_many.js";
import { createBulkStaffPreferenceValidation } from "@shared/api/staffPreference/validations/create_bulk.js";
import type { Request, Response } from "express";
import { bulkCreateStaffPreference } from "../../../repositories/staffPreference.js";
import { toStaffPreferenceDTO, toStaffPreferencesDTO } from "../toDTO.js";

export const createBulkStaffPreferenceController = async (
	req: Request,
	res: Response<
		CrateBulkStaffPreferencesResponse | ErrorResponse | ValidationErrorResponse
	>,
): Promise<void> => {
	try {
		const auth = req.auth;
		if (!auth?.uid || !auth?.sid) {
			return void res.status(401).json({ ok: false, message: "Unauthorized" });
		}
		const [userId, storeId] = [auth.uid, auth.sid];

		const parsed = createBulkStaffPreferenceValidation.safeParse(req.body);
		if (!parsed.success) {
			return void res.status(400).json({
				ok: false,
				message: "invalid request value",
				errors: parsed.error.errors,
			});
		}
		const data = { ...parsed.data, userId, storeId };

		const BatchPayload = await bulkCreateStaffPreference(data);

		return void res.status(200).json({
			ok: true,
			count: BatchPayload.count,
		});
	} catch (error) {
		console.error("Error in getStaffPreferencesController:", error);
		res.status(500).json({ ok: false, message: "Internal Server Error" });
	}
};
