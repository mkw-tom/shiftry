import type { ShiftPosition } from "../../common/types/prisma.js";

export type GetShfitPositionsResponse = {
	ok: boolean;
	shiftPositions: ShiftPosition[];
};
