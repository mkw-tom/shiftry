import type { ShiftPosition } from "../../common/types/prisma";

export type BulkUpsertShiftPositionsResponse = {
	ok: boolean;
	shiftPositions: ShiftPosition[];
};
