import type { ShiftRequest } from "../../../common/types/prisma";

export interface DeleteShiftRequestResponse {
	ok: true;
	shiftRequest: ShiftRequest;
}
