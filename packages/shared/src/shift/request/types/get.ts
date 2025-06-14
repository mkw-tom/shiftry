import type { ShiftRequest } from "../../../common/types/prisma";

export interface GetShiftRequestResponse {
	ok: true;
	shiftRequests: ShiftRequest[];
}
