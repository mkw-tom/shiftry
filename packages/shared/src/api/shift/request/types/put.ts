import type { ShiftRequest } from "../../../common/types/prisma.js";

export interface UpsertShiftRequetResponse {
	ok: true;
	shiftRequest: ShiftRequest;
}
