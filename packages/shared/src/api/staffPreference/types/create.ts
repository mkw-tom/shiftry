import type { StaffPreferenceDTO } from "../dto.js";

export type CreateStaffPreferenceResponse = {
	ok: true;
	staffPreference: StaffPreferenceDTO;
};
