import type { ShiftRequestDTO } from "../dto.js";

export interface UpsertShiftRequetResponse {
	ok: true;
	shiftRequest: ShiftRequestDTO;
}
