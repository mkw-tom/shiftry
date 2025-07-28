import type { ShiftPosition } from "@shared/api/common/types/prisma";
import prisma from "../config/database";

export const getShiftPositionsByStoreId = async (
	storeId: string,
): Promise<ShiftPosition[]> => {
	return await prisma.shiftPosition.findMany({
		where: { storeId },
	});
};

const upsertShiftPosition = async (
	storeId: string,
	name: string,
	startTime: string,
	endTime: string,
	jobRoles: string[],
): Promise<ShiftPosition> => {
	return await prisma.shiftPosition.upsert({
		where: { storeId_name: { storeId, name } },
		create: {
			storeId,
			name,
			startTime: new Date(startTime),
			endTime: new Date(endTime),
			jobRoles,
		},
		update: {
			name,
			startTime: new Date(startTime),
			endTime: new Date(endTime),
			jobRoles,
		},
	});
};

const deleteManyShiftPositions = async (storeId: string, ids: string[]) => {
	return await prisma.shiftPosition.deleteMany({
		where: {
			storeId,
			id: { in: ids },
		},
	});
};

const upsertManyShiftPositions = async (
	storeId: string,
	datas: {
		name: string;
		startTime: string;
		endTime: string;
		jobRoles: string[];
	}[],
): Promise<ShiftPosition[]> => {
	return await Promise.all(
		datas.map((data) =>
			upsertShiftPosition(
				storeId,
				data.name,
				data.startTime,
				data.endTime,
				data.jobRoles,
			),
		),
	);
};

export const bulkUpsertShiftPositions = async (
	storeId: string,
	datas: {
		name: string;
		startTime: string;
		endTime: string;
		jobRoles: string[];
	}[],
): Promise<ShiftPosition[]> => {
	const existing = await getShiftPositionsByStoreId(storeId);
	const namesToKeep = new Set(datas.map((d) => d.name));
	const toDelete = existing.filter((pos) => !namesToKeep.has(pos.name));
	const deleteIds = toDelete.map((p) => p.id);
	await deleteManyShiftPositions(storeId, deleteIds);

	const upserted = await upsertManyShiftPositions(storeId, datas);
	return upserted;
};
