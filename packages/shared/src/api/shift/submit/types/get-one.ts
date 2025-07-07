import type { SubmittedShift } from "../../../common/types/prisma";

export interface GetSubmittedShiftUserOneResponse {
	ok: true;
	submittedShift: SubmittedShift | null;
}
