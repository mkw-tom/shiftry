import type { SubmittedShiftDTO } from "../dto.js";

export interface GetSubmittedShiftsSpecificResponse {
	ok: true;
	submittedShifts: SubmittedShiftDTO[];
}
