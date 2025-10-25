import {
	UserLite,
	type UserStoreLiteWithUserAndJobRoles,
} from "../../../api/common/types/prismaLite.js";
import type { StaffPreferenceDTO } from "../dto.js";

export type CreateStaffPreferenceResponse = {
	ok: true;
	staffPreference: StaffPreferenceDTO;
	user?: Pick<UserStoreLiteWithUserAndJobRoles, "user" | "role">;
};
