import type { AssignShift } from "@shared/api/common/types/prisma";
import prisma from "../config/database";
import type { upsertAssignShfitInputType } from "../types/inputs";

export const upsertAssignShfit = async (
	storeId: string,
	data: upsertAssignShfitInputType,
): Promise<AssignShift> => {
	return await prisma.assignShift.upsert({
		where: { shiftRequestId: data.shiftRequestId },
		update: {
			shifts: data.shifts,
			status: data.status,
		},
		create: {
			storeId: storeId,
			shiftRequestId: data.shiftRequestId,
			shifts: data.shifts,
			status: data.status,
		},
	});
};

export const getAssignShift = async (
	shiftRequestId: string,
): Promise<AssignShift | null> => {
	return await prisma.assignShift.findUnique({
		where: { shiftRequestId },
	});
};
