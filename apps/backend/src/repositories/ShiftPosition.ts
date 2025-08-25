import type { ShiftPosition } from "@shared/api/common/types/prisma.js";
import type { UpsertShiftPositionType } from "@shared/api/shiftPosition/validations/put-bulk.js";
import prisma from "../config/database.js";

export const getShiftPositionsByStoreId = async (
	storeId: string,
): Promise<ShiftPosition[]> => {
	return await prisma.shiftPosition.findMany({
		where: { storeId },
	});
};

const upsertShiftPosition = async (
	storeId: string,
	data: UpsertShiftPositionType,
): Promise<ShiftPosition> => {
	return await prisma.shiftPosition.upsert({
		where: { storeId_name: { storeId, name: data.name } },
		create: {
			storeId,
			name: data.name,
			startTime: new Date(data.startTime),
			endTime: new Date(data.endTime),
			jobRoles: data.jobRoles,
			count: data.count,
			priority: data.priority,
			absolute: data.absolute,
			weeks: data.weeks,
		},
		update: {
			name: data.name,
			startTime: new Date(data.startTime),
			endTime: new Date(data.endTime),
			jobRoles: data.jobRoles,
			count: data.count,
			priority: data.priority,
			absolute: data.absolute,
			weeks: data.weeks,
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
	datas: UpsertShiftPositionType[],
): Promise<ShiftPosition[]> => {
	return await Promise.all(
		datas.map((data) => upsertShiftPosition(storeId, data)),
	);
};

export const bulkUpsertShiftPositions = async (
	storeId: string,
	datas: UpsertShiftPositionType[],
): Promise<ShiftPosition[]> => {
	const existing = await getShiftPositionsByStoreId(storeId);
	const namesToKeep = new Set(datas.map((d) => d.name));
	const toDelete = existing.filter((pos) => !namesToKeep.has(pos.name));
	const deleteIds = toDelete.map((p) => p.id);
	await deleteManyShiftPositions(storeId, deleteIds);

	const upserted = await upsertManyShiftPositions(storeId, datas);
	return upserted;
};
