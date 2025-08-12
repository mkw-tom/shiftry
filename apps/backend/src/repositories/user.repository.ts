import type { Prisma, PrismaClient } from "@prisma/client";
import type { UpsertUserRepositoryInputType } from "@shared/api/auth/types/register-owner";
import type { User, UserRole } from "@shared/api/common/types/prisma";
import prisma from "../config/database";
import type { UpsertUserInput, updateUserProlfileType } from "../types/inputs";

export const getUsers = async (): Promise<User[]> => {
	return await prisma.user.findMany();
};

export const getUserById = async (userId: string): Promise<User | null> => {
	return await prisma.user.findUnique({
		where: { id: userId },
	});
};

export const getUserByLineId = async (lineId: string): Promise<User | null> => {
	return await prisma.user.findUnique({
		where: { lineId: lineId },
	});
};

// export const upsertUser = async (data: UpsertUserInput): Promise<User> => {
// 	return await prisma.user.upsert({
// 		where: { lineId: data.lineId },
// 		create: data,
// 		update: data,
// 	});
// };

export const upsertUser = async (
	data: UpsertUserRepositoryInputType,
	db: Prisma.TransactionClient | PrismaClient = prisma,
) => {
	return await db.user.upsert({
		where: { lineId_hash: data.lineId_hash },
		create: data,
		update: data, // ← Prisma で upsert の update は必要
		select: { id: true, name: true },
	});
};

export const updateUser = async (
	userId: string,
	data: updateUserProlfileType,
): Promise<User> => {
	return prisma.user.update({
		where: { id: userId },
		data,
	});
};

export const changeUserRole = async (
	userId: string,
	role: UserRole,
): Promise<User> => {
	return await prisma.user.update({
		where: { id: userId },
		data: {
			role: role as UserRole,
		},
	});
};

export const deleteUser = async (userId: string): Promise<User> => {
	return prisma.user.delete({
		where: { id: userId },
	});
};
