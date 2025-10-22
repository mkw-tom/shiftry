import type { CreateStaffPreferenceInput } from "@shared/api/staffPreference/validations/create.js";
import type { CreateBulkStaffPreferenceInput } from "@shared/api/staffPreference/validations/create_bulk.js";
import type { UpdateStaffPreferenceInput } from "@shared/api/staffPreference/validations/update.js";
import type { UpdateBulkStaffPreferenceInput } from "@shared/api/staffPreference/validations/update_bulk.js";
import prisma from "../config/database.js";

// 1件取得
export const getStaffPreference = async (userId: string, storeId: string) => {
	return prisma.staffPreference.findUnique({
		where: { userId_storeId: { userId, storeId } },
	});
};

// 全スタッフ分取得
export const getStaffPreferencesByStoreId = async (storeId: string) => {
	return prisma.staffPreference.findMany({
		where: { storeId },
	});
};

// 1件作成
export const createStaffPreference = async (
	data: CreateStaffPreferenceInput,
) => {
	return prisma.staffPreference.create({ data });
};

// 複数件一括作成
export const bulkCreateStaffPreference = async (
	data: CreateBulkStaffPreferenceInput,
) => {
	return prisma.staffPreference.createMany({ data });
};

// 1件更新
export const updateStaffPreference = async (
	userId: string,
	storeId: string,
	data: UpdateStaffPreferenceInput,
) => {
	return prisma.staffPreference.update({
		where: { userId_storeId: { userId, storeId } },
		data,
	});
};

// 複数件一括更新
export const bulkUpdateStaffPreference = async (
	storeId: string,
	data: UpdateBulkStaffPreferenceInput,
) => {
	return prisma.staffPreference.updateMany({
		where: { storeId },
		data: data,
	});
};
