import type { ShiftRequest } from "../../../common/types/prisma";

export interface UpsertShiftRequetResponse {
	ok: true;
	shiftRequest: ShiftRequest;
}
