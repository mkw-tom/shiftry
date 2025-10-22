import type {
	ErrorResponse,
	ValidationErrorResponse,
} from "@shared/api/common/types/errors.js";
import type { UpdateStaffPreferenceResponse } from "@shared/api/staffPreference/types/update.js";
import { updateStaffPreferenceValidation } from "@shared/api/staffPreference/validations/update.js";
import type { Request, Response } from "express";
import { updateStaffPreference } from "../../../repositories/staffPreference.js";
import { toStaffPreferenceDTO } from "../toDTO.js";

export const updateStaffPreferenceController = async (
	req: Request,
	res: Response<
		UpdateStaffPreferenceResponse | ErrorResponse | ValidationErrorResponse
	>,
): Promise<void> => {
	try {
		const auth = req.auth;
		if (!auth?.uid || !auth?.sid) {
			return void res.status(401).json({ ok: false, message: "Unauthorized" });
		}
		const [userId, storeId] = [auth.uid, auth.sid];

		const parsed = updateStaffPreferenceValidation.safeParse(req.body);
		if (!parsed.success) {
			return void res.status(400).json({
				ok: false,
				message: "invalid request value",
				errors: parsed.error.errors,
			});
		}
		const data = parsed.data;

		const staffPreference = await updateStaffPreference(userId, storeId, data);
		const StaffPreferenceDTO = toStaffPreferenceDTO(staffPreference);

		return void res.status(200).json({
			ok: true,
			staffPreference: StaffPreferenceDTO,
		});
	} catch (error) {
		console.error("Error in getStaffPreferencesController:", error);
		res.status(500).json({ ok: false, message: "Internal Server Error" });
	}
};
