import type { StaffPreferenceDTO } from "../dto.js";

export type GetStaffPreferenceAllResponse = {
	ok: true;
	staffPreferences: StaffPreferenceDTO[];
};
