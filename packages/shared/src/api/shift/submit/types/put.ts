import type { SubmittedShiftDTO } from "../dto.js";

export interface UpsertSubmittedShfitResponse {
	ok: true;
	submittedShift: SubmittedShiftDTO;
}
