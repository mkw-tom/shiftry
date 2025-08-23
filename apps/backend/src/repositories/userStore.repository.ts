import type { Prisma, PrismaClient } from "@prisma/client";
import type {
	Store,
	User,
	UserRole,
	UserStore,
} from "@shared/api/common/types/prisma.js";
import type {
	UserStoreLite,
	UserStoreLiteWithStore,
	UserStoreLiteWithUserAndJobRoles,
} from "@shared/api/common/types/prismaLite.js";
import prisma from "../config/database.js";

export const createUserStore = async (
	userId: string,
	storeId: string,
	role: UserRole,
	db: Prisma.TransactionClient | PrismaClient = prisma,
): Promise<UserStoreLiteWithStore> => {
	return await db.userStore.create({
		data: {
			userId,
			storeId,
			role,
		},
		select: {
			userId: true,
			storeId: true,
			role: true,
			store: {
				select: { id: true, name: true, isActive: true },
			},
		},
	});
};

///　userIdから中間テーブルの店舗データを取得
export const getUserStoreByUserId = async (
	userId: string,
): Promise<UserStoreLite | null> => {
	return await prisma.userStore.findFirst({
		where: { userId },
		select: { userId: true, storeId: true, role: true },
	});
};

export const getUserStoresByLineIdHash = async (
	userId: string,
): Promise<UserStoreLiteWithStore[]> => {
	return await prisma.userStore.findMany({
		where: { userId },
		select: {
			userId: true,
			storeId: true,
			role: true,
			store: { select: { id: true, name: true, isActive: true } },
		},
	});
};

/// lineグループに紐づいていないユーザーの店舗データを取得
export const getUserStoresUnconnectedGroupByUserId = async (
	userId: string,
): Promise<UserStoreLiteWithStore[]> => {
	return await prisma.userStore.findMany({
		where: { userId, store: { groupId_hash: null, groupId_enc: null } },
		select: {
			userId: true,
			storeId: true,
			role: true,
			store: { select: { id: true, name: true, isActive: true } },
		},
		orderBy: { store: { createdAt: "desc" } },
	});
};

export const getUserStoreByUserIdAndStoreId = async (
	userId: string,
	storeId: string,
	db: Prisma.TransactionClient | PrismaClient = prisma,
): Promise<UserStoreLiteWithStore | null> => {
	return db.userStore.findUnique({
		where: { userId_storeId: { userId, storeId } },
		select: {
			userId: true,
			storeId: true,
			role: true,
			store: { select: { id: true, name: true, isActive: true } },
		},
	});
};

///ユーザーが所属する全ての店舗データを取得

export const getStoresFromUser = async (
	userId: string,
): Promise<UserStoreLiteWithStore[]> => {
	return await prisma.userStore.findMany({
		where: { userId },
		select: {
			userId: true,
			storeId: true,
			role: true,
			store: {
				select: {
					id: true,
					name: true,
					isActive: true,
				},
			},
		},
	});
};

///店舗に所属するすべてのユーザーデータを取得
export const getMemberFromStore = async (
	storeId: string,
): Promise<UserStoreLiteWithUserAndJobRoles[]> => {
	return await prisma.userStore.findMany({
		where: { storeId },
		select: {
			userId: true,
			storeId: true,
			role: true,
			user: {
				select: {
					id: true,
					name: true,
					pictureUrl: true,
					jobRoles: {
						select: {
							roleId: true,
							role: {
								select: {
									id: true,
									name: true,
								},
							},
						},
					},
				},
			},
		},
	});
};

export const changeUserRoleToUserStore = async (
	userId: string,
	storeId: string,
	role: UserRole,
): Promise<UserStore> => {
	return await prisma.userStore.update({
		where: {
			userId_storeId: {
				userId: userId,
				storeId: storeId,
			},
		},
		data: {
			role: role,
		},
	});
};
