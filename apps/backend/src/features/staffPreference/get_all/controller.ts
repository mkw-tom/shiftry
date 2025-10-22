import type { ErrorResponse } from "@shared/api/common/types/errors.js";
import type { GetStaffPreferenceAllResponse } from "@shared/api/staffPreference/types/get_all.js";
import type { Request, Response } from "express";
import { getStaffPreferencesByStoreId } from "../../../repositories/staffPreference.js";
import { toStaffPreferencesDTO } from "../toDTO.js";

export const getStaffPreferenceAllController = async (
	req: Request,
	res: Response<GetStaffPreferenceAllResponse | ErrorResponse>,
): Promise<void> => {
	try {
		const auth = req.auth;
		if (!auth?.uid || !auth?.sid) {
			return void res.status(401).json({ ok: false, message: "Unauthorized" });
		}
		const storeId = auth.sid;
		const staffPreferences = await getStaffPreferencesByStoreId(storeId);
		if (!staffPreferences) {
			return void res
				.status(404)
				.json({ ok: false, message: "Staff preferences not found" });
		}

		const StaffPreferencesDTO = toStaffPreferencesDTO(staffPreferences);

		return void res.status(200).json({
			ok: true,
			staffPreferences: StaffPreferencesDTO,
		});
	} catch (error) {
		console.error("Error in getStaffPreferencesController:", error);
		res.status(500).json({ ok: false, message: "Internal Server Error" });
	}
};
