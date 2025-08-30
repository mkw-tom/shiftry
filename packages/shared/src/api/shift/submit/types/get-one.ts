import type { SubmittedShiftDTO } from "../dto.js";

export interface GetSubmittedShiftUserOneResponse {
	ok: true;
	submittedShift: SubmittedShiftDTO | null;
}
