import type { ShiftPositionDTO } from "../dto.js";

export type GetShiftPositionsResponse = {
	ok: true;
	shiftPositions: ShiftPositionDTO[];
};
