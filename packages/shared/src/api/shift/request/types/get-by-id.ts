import type { ShiftRequestDTO } from "../dto.js";

export interface GetShiftRequestSpecificResponse {
	ok: true;
	shiftRequest: ShiftRequestDTO;
}
