import type { SubmittedShift } from "../../../common/types/prisma.js";

export interface GetSubmittedShiftUserOneResponse {
	ok: true;
	submittedShift: SubmittedShift | null;
}
