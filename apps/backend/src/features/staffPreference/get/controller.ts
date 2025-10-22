import type { ErrorResponse } from "@shared/api/common/types/errors.js";
import type { GetStaffPreferenceResponse } from "@shared/api/staffPreference/types/get.js";
import type { Request, Response } from "express";
import { getStaffPreference } from "../../../repositories/staffPreference.js";
import { toStaffPreferenceDTO } from "../toDTO.js";

export const getStaffPreferencesController = async (
	req: Request,
	res: Response<GetStaffPreferenceResponse | ErrorResponse>,
): Promise<void> => {
	try {
		const auth = req.auth;
		if (!auth?.uid || !auth?.sid) {
			return void res.status(401).json({ ok: false, message: "Unauthorized" });
		}
		const [userId, storeId] = [auth.uid, auth.sid];
		const staffPreference = await getStaffPreference(userId, storeId);
		if (!staffPreference) {
			return void res
				.status(404)
				.json({ ok: false, message: "Staff preferences not found" });
		}

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
