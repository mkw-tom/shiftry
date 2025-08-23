import type { SubmittedShift } from "../../../common/types/prisma.js";

export interface GetSubmittedShiftMeResponse {
	ok: true;
	submittedShifts: SubmittedShift[];
}
