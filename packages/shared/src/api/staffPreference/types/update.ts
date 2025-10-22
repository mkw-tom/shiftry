import type { StaffPreferenceDTO } from "../dto.js";

export type UpdateStaffPreferenceResponse = {
	ok: true;
	staffPreference: StaffPreferenceDTO;
};
