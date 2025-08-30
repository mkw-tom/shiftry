import type { SubmittedShift } from "../../../common/types/prisma.js";
import type { SubmittedShiftDTO } from "../dto.js";

export interface GetSubmittedShiftMeResponse {
	ok: true;
	submittedShifts: SubmittedShiftDTO[];
}
