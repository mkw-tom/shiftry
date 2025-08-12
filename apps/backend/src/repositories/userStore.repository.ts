import type { Prisma, PrismaClient } from "@prisma/client";
import type {
	Store,
	User,
	UserRole,
	UserStore,
} from "@shared/api/common/types/prisma.js";
import prisma from "../config/database.js";

export const createUserStore = async (
	userId: string,
	storeId: string,
	role: UserRole,
	db: Prisma.TransactionClient | PrismaClient = prisma,
): Promise<UserStore> => {
	return await db.userStore.create({
		data: {
			userId,
			storeId,
			role,
		},
		select: { userId: true, storeId: true, role: true },
	});
};

///　userIdから中間テーブルの店舗データを取得
export const getUserStoreByUserId = async (
	userId: string,
): Promise<UserStore | null> => {
	return await prisma.userStore.findFirst({
		where: { userId },
		select: { userId: true, storeId: true, role: true },
	});
};

export const getUserStoreByUserIdAndStoreId = async (
	userId: string,
	storeId: string,
): Promise<UserStore | null> => {
	return await prisma.userStore.findFirst({
		where: { userId, storeId },
		select: { userId: true, storeId: true, role: true },
	});
};

///ユーザーが所属する全ての店舗データを取得
export const getStoreFromUser = async (
	userId: string,
): Promise<{ store: Store }[]> => {
	return await prisma.userStore.findMany({
		where: { userId },
		select: { store: true },
	});
};

///店舗に所属するすべてのユーザーデータを取得
export const getUsersFromStore = async (
	storeId: string,
): Promise<
	{
		user: {
			id: string;
			name: string;
			pictureUrl: string | null;
			jobRoles: { roleId: string; role: { id: string; name: string } }[];
		};
	}[]
> => {
	return await prisma.userStore.findMany({
		where: { storeId },
		include: {
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
