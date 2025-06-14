import type { SubmittedShift } from "../../../common/types/prisma";

export interface GetSubmittedShiftUserResponse {
	ok: true;
	submittedShifts: SubmittedShift[];
}
