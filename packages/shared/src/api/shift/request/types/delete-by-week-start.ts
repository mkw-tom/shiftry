import type { ShiftRequest } from "../../../common/types/prisma.js";

export interface DeleteShiftRequestResponse {
	ok: true;
	shiftRequest: ShiftRequest;
}
