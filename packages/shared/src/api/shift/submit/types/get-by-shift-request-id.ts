import type { SubmittedShift } from "../../../common/types/prisma";

export interface GetSubmittedShiftsSpecificResponse {
	ok: true;
	submittedShifts: SubmittedShift[];
}
