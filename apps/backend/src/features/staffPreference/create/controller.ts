import type {
	ErrorResponse,
	ValidationErrorResponse,
} from "@shared/api/common/types/errors.js";
import type { CreateStaffPreferenceResponse } from "@shared/api/staffPreference/types/create.js";
import { createStaffPreferenceValidation } from "@shared/api/staffPreference/validations/create.js";
import type { Request, Response } from "express";
import { createStaffPreference } from "../../../repositories/staffPreference.js";
import { toStaffPreferenceDTO } from "../toDTO.js";

export const createStaffPreferenceController = async (
	req: Request,
	res: Response<
		CreateStaffPreferenceResponse | ErrorResponse | ValidationErrorResponse
	>,
): Promise<void> => {
	try {
		const auth = req.auth;
		if (!auth?.uid || !auth?.sid) {
			return void res.status(401).json({ ok: false, message: "Unauthorized" });
		}
		const [userId, storeId] = [auth.uid, auth.sid];

		const parsed = createStaffPreferenceValidation.safeParse(req.body);
		if (!parsed.success) {
			return void res.status(400).json({
				ok: false,
				message: "invalid request value",
				errors: parsed.error.errors,
			});
		}
		const data = { ...parsed.data, userId, storeId };

		const staffPreference = await createStaffPreference(data);
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
