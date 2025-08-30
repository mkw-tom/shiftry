import type { ShiftRequestDTO } from "../dto.js";

export interface GetShiftRequestResponse {
	ok: true;
	shiftRequests: ShiftRequestDTO[];
}
