import type { SubmittedShift } from "../../../common/types/prisma.js";

export interface GetSubmittedShiftUserResponse {
	ok: true;
	submittedShifts: SubmittedShift[];
}
