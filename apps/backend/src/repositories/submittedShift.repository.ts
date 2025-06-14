import type { Prisma } from "@prisma/client";
import type { SubmittedShift } from "@shared/common/types/prisma";
import prisma from "../config/database";
import type { UpsertSubmittedShiftInputType } from "../types/inputs";

export const upsertSubmittedShift = async (
	userId: string,
	storeId: string,
	data: UpsertSubmittedShiftInputType,
): Promise<SubmittedShift> => {
	return await prisma.submittedShift.upsert({
		where: {
			userId_shiftRequestId: {
				userId: userId,
				shiftRequestId: data.shiftRequestId,
			},
		},
		update: {
			shifts: data.shifts as Prisma.JsonObject,
			status: data.status,
		},
		create: {
			userId: userId,
			storeId: storeId,
			shiftRequestId: data.shiftRequestId,
			shifts: data.shifts as Prisma.JsonObject,
			status: data.status,
		},
	});
};

export const getSubmittedShiftUser = async (
	userId: string,
	storeId: string,
): Promise<SubmittedShift[]> => {
	return await prisma.submittedShift.findMany({
		where: { userId, storeId },
	});
};
export const getSubmittedShiftUserOne = async (
	userId: string,
	shiftRequestId: string,
): Promise<SubmittedShift | null> => {
	return await prisma.submittedShift.findUnique({
		where: {
			userId_shiftRequestId: {
				userId,
				shiftRequestId,
			},
		},
	});
};

export const getSubmittedShiftsSpecific = async (
	shiftRequestId: string,
): Promise<SubmittedShift[]> => {
	return await prisma.submittedShift.findMany({
		where: { shiftRequestId },
	});
};
