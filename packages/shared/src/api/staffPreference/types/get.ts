import type { StaffPreferenceDTO } from "../dto.js";

export type GetStaffPreferenceResponse = {
	ok: true;
	staffPreference: StaffPreferenceDTO;
};
