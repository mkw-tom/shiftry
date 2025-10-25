import type {
	ErrorResponse,
	ValidationErrorResponse,
} from "@shared/api/common/types/errors.js";
import type { UserLite } from "@shared/api/common/types/prismaLite.js";
import type { CreateStaffPreferenceResponse } from "@shared/api/staffPreference/types/create.js";
import { createEditStaffPreferenceValidatonExtendUserName } from "@shared/api/staffPreference/validations/create.js";
import type { Request, Response } from "express";
import { createStaffPreference } from "../../../repositories/staffPreference.js";
import { createUserByHand } from "../../../repositories/user.repository.js";
import { createUserStore } from "../../../repositories/userStore.repository.js";
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

		const parsed = createEditStaffPreferenceValidatonExtendUserName.safeParse(
			req.body,
		);
		if (!parsed.success) {
			return void res.status(400).json({
				ok: false,
				message: "invalid request value",
				errors: parsed.error.errors,
			});
		}

		if (parsed.data.userName) {
			const newUser = await createUserByHand(parsed.data.userName);
			const userStore = await createUserStore(userId, storeId, "STAFF");
			const data = { ...parsed.data, storeId, userId: newUser.id };
			const staffPreference = await createStaffPreference(data);
			const StaffPreferenceDTO = toStaffPreferenceDTO(staffPreference);
			return void res.status(200).json({
				ok: true,
				staffPreference: StaffPreferenceDTO,
				user: {
					user: { ...(newUser as UserLite), jobRoles: [] },
					role: userStore.role,
				},
			});
		}

		const data = { ...parsed.data, storeId, userId: auth.uid };
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
