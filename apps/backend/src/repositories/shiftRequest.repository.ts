import type { ShiftRequest } from "@shared/api/common/types/prisma";
import prisma from "../config/database";
import type { UpsertShiftRequetType } from "../types/inputs";

export const upsertShiftRequest = async (
	storeId: string,
	data: UpsertShiftRequetType,
): Promise<ShiftRequest> => {
	return await prisma.shiftRequest.upsert({
		where: {
			storeId_weekStart: {
				storeId: storeId,
				weekStart: new Date(data.weekStart),
			},
		},
		update: {
			storeId: storeId,
			requests: data.requests,
			status: data.status,
			deadline: new Date(data.deadline),
			weekStart: new Date(data.weekStart),
			weekEnd: new Date(data.weekEnd),
		},
		create: {
			storeId: storeId,
			requests: data.requests,
			status: data.status,
			deadline: new Date(data.deadline),
			weekStart: new Date(data.weekStart),
			weekEnd: new Date(data.weekEnd),
		},
	});
};

export const deleteShiftRequest = async (
	storeId: string,
	weekStart: string,
): Promise<ShiftRequest> => {
	return await prisma.shiftRequest.delete({
		where: { storeId_weekStart: { storeId, weekStart: new Date(weekStart) } },
	});
};

export const getShiftRequestByStoreId = async (
	storeId: string,
): Promise<ShiftRequest[]> => {
	return await prisma.shiftRequest.findMany({
		where: { storeId },
	});
};

export const getShiftRequestSpecific = async (
	storeId: string,
	weekStart: string,
): Promise<ShiftRequest | null> => {
	return await prisma.shiftRequest.findUnique({
		where: {
			storeId_weekStart: {
				storeId,
				weekStart: new Date(weekStart),
			},
		},
	});
};

export const getShiftRequestById = async (
	id: string,
): Promise<ShiftRequest | null> => {
	return await prisma.shiftRequest.findUnique({
		where: { id },
	});
};
