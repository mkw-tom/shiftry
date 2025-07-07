import type { Store } from "@shared/api/common/types/prisma";
import prisma from "../config/database";

export const createStore = async (name: string): Promise<Store> => {
	return await prisma.store.create({
		data: {
			name: name,
		},
	});
};

export const getStoreByGroupId = async (
	groupId: string,
): Promise<Store | null> => {
	return await prisma.store.findUnique({
		where: { groupId: groupId },
	});
};

export const getStoreById = async (id: string): Promise<Store | null> => {
	return await prisma.store.findUnique({
		where: { id: id },
	});
};

export const updateStoreGroupId = async (
	storeId: string,
	groupId: string,
): Promise<Store> => {
	return await prisma.store.update({
		where: { id: storeId },
		data: { groupId: groupId },
	});
};

export const updateStoreName = async (
	storeId: string,
	name: string,
): Promise<Store> => {
	return await prisma.store.update({
		where: { id: storeId },
		data: {
			name: name,
		},
	});
};

// 店舗削除
export const deleteStore = async (id: string): Promise<Store> => {
	return await prisma.store.delete({
		where: { id },
	});
};
