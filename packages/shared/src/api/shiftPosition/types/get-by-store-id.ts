import type { ShiftPosition } from "../../common/types/prisma";

export type GetShfitPositionsByStoreIdResponse = {
	ok: boolean;
	shiftPositions: ShiftPosition[];
};
