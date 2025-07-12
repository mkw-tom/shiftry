import type { ShiftRequest } from "@shared/api/common/types/prisma";
import { addHours, startOfToday, subDays } from "date-fns";
import prisma from "../config/database";
import type { UpsertShiftRequetType } from "../types/inputs";

const jstStartOfToday = addHours(startOfToday(), 9);

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

export const getActiveShiftRequests = async (
	storeId: string,
): Promise<ShiftRequest[]> => {
	return await prisma.shiftRequest.findMany({
		where: {
			storeId,
			weekEnd: {
				not: null,
				gte: jstStartOfToday, // 今日以降のweekEndのみ取得
			},
		},
		orderBy: {
			weekStart: "asc", //昇順
		},
	});
};

export const getArchivedShiftRequests = async (
	storeId: string,
): Promise<ShiftRequest[]> => {
	return await prisma.shiftRequest.findMany({
		where: {
			storeId,
			weekEnd: {
				not: null,
				lt: jstStartOfToday, // 今日より前
			},
		},
		orderBy: {
			weekStart: "desc", //降順
		},
	});
};
