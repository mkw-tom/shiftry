import type { Prisma, PrismaClient } from "@prisma/client";
import type { Store } from "@shared/api/common/types/prisma.js";
import type { StoreLite } from "@shared/api/common/types/prismaLite.js";
import prisma from "../config/database.js";

export const createStore = async (
	name: string,
	db: Prisma.TransactionClient | PrismaClient = prisma,
): Promise<StoreLite> => {
	return await db.store.create({
		data: {
			name: name,
			isActive: true,
		},
		select: { id: true, name: true, isActive: true },
	});
};

// export const getStoreByGroupId = async (
// 	groupId: string,
// ): Promise<Store | null> => {
// 	return await prisma.store.findUnique({
// 		where: { groupId: groupId },
// 	});
// };

export const getStoreByGroupIdHash = async (
	groupId_hash: string,
	db: Prisma.TransactionClient | PrismaClient = prisma,
): Promise<StoreLite | null> => {
	return await db.store.findUnique({
		where: { groupId_hash: groupId_hash },
		select: { id: true, name: true, isActive: true },
	});
};

export const getStoreById = async (id: string): Promise<StoreLite | null> => {
	return await prisma.store.findUnique({
		where: { id: id },
		select: { id: true, name: true, isActive: true },
	});
};

// export const updateStoreGroupId = async (
// 	storeId: string,
// 	groupId: string,
// ): Promise<Store> => {
// 	return await prisma.store.update({
// 		where: { id: storeId },
// 		data: { groupId: groupId },
// 	});
// };

export const connectStoreToGroup = async (
	storeId: string,
	groupId_hash: string,
	groupId_enc: string,
	groupKeyVersion_hash: string,
	groupKeyVersion_enc: string,
	db: Prisma.TransactionClient | PrismaClient = prisma,
): Promise<StoreLite> => {
	return await db.store.update({
		where: { id: storeId },
		data: {
			groupId_hash,
			groupId_enc,
			groupKeyVersion_hash,
			groupKeyVersion_enc,
		},
		select: {
			id: true,
			name: true,
			isActive: true,
		},
	});
};

export const findStoreByGroupHashExcept = (
	groupId_hash: string,
	exceptStoreId: string,
): Promise<StoreLite | null> => {
	return prisma.store.findFirst({
		where: { groupId_hash, isActive: true, NOT: { id: exceptStoreId } },
		select: { id: true, name: true, isActive: true },
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
