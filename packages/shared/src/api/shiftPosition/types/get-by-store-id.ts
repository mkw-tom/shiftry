import type { ShiftPosition } from "../../common/types/prisma.js";

export type GetShfitPositionsByStoreIdResponse = {
	ok: boolean;
	shiftPositions: ShiftPosition[];
};
