import type { ShiftPosition } from "../../common/types/prisma.js";

export type BulkUpsertShiftPositionsResponse = {
	ok: boolean;
	shiftPositions: ShiftPosition[];
};
