import type { ShiftRequest } from "../../../common/types/prisma.js";

export interface GetShiftRequestResponse {
	ok: true;
	shiftRequests: ShiftRequest[];
}
