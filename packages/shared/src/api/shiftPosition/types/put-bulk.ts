import type { ShiftPosition } from "../../common/types/prisma.js";
import type { ShiftPositionDTO } from "../dto.js";

export type BulkUpsertShiftPositionsResponse = {
	ok: boolean;
	shiftPositions: ShiftPositionDTO[];
};
