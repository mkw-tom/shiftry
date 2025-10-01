import type { Prisma, PrismaClient } from "@prisma/client";
import type { AssignShift } from "@shared/api/common/types/prisma.js";
import prisma from "../config/database.js";
import type { UpsertAssignShfitInput } from "../types/inputs.js";

export const upsertAssignShfit = async (
	storeId: string,
	data: UpsertAssignShfitInput,
	db: Prisma.TransactionClient | PrismaClient = prisma,
): Promise<AssignShift> => {
	return await db.assignShift.upsert({
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
