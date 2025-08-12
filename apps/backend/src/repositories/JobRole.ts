import type { JobRole } from "@shared/api/common/types/prisma.js";
import prisma from "../config/database.js";

export const GetJobRoleByStoreId = async (
	storeId: string,
): Promise<JobRole[]> => {
	return await prisma.jobRole.findMany({
		where: {
			storeId: storeId,
		},
	});
};

const upsertJobRole = async (
	storeId: string,
	name: string,
): Promise<JobRole> => {
	return await prisma.jobRole.upsert({
		where: { storeId_name: { storeId, name } },
		create: {
			storeId: storeId,
			name: name,
		},
		update: {
			name: name,
		},
	});
};

const deleteManyJobRoles = async (storeId: string, ids: string[]) => {
	return await prisma.jobRole.deleteMany({
		where: {
			storeId: storeId,
			id: {
				in: ids,
			},
		},
	});
};

const upsertManyJobRoles = async (
	storeId: string,
	names: string[],
): Promise<JobRole[]> => {
	return await Promise.all(names.map((name) => upsertJobRole(storeId, name)));
};

export const bulkUpsertJobRoles = async (
	storeId: string,
	names: string[],
): Promise<JobRole[]> => {
	// 1. 既存のJobRole一覧を取得
	const existingRoles = await GetJobRoleByStoreId(storeId);

	// 2. 今回送られてきたname一覧と差分を取る
	const namesToKeep = new Set(names);
	const rolesToDelete = existingRoles.filter(
		(role) => !namesToKeep.has(role.name),
	);

	// 3. 差分を削除（CascadeでuserJobRole等も消える想定）
	const deleteIds = rolesToDelete.map((role) => role.id);
	await deleteManyJobRoles(storeId, deleteIds);

	// 4. 残りをUpsertで追加/更新

	const upsertedRoles = await upsertManyJobRoles(storeId, names);

	return upsertedRoles;
};
