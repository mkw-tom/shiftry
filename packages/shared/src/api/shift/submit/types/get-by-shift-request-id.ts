import type { SubmittedShift } from "../../../common/types/prisma.js";

export interface GetSubmittedShiftsSpecificResponse {
	ok: true;
	submittedShifts: SubmittedShift[];
}
