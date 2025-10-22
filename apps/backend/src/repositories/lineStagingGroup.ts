import type { Prisma, PrismaClient } from "@prisma/client";
import prisma from "../config/database.js";

export const createLineStagingGroup = async (
	db: Prisma.TransactionClient | PrismaClient,
	data: {
		groupId_hash: string;
		groupId_enc: string;
		groupKeyVersion_enc: string;
		groupKeyVersion_hash: string;
		expiresAt: Date;
	},
) => {
	const lineStagingGroup = await db.lineStagingGroup.create({
		data,
	});
	return lineStagingGroup;
};

export const getLineStagingGroupByHash = async (
	groupId_hash: string,
	db: Prisma.TransactionClient | PrismaClient = prisma,
) => {
	const lineStagingGroup = await db.lineStagingGroup.findUnique({
		where: { groupId_hash },
		include: {
			members: true,
		},
	});
	return lineStagingGroup;
};

export const deleteLineStagingGroupByHash = async (
	groupId_hash: string,
	db: Prisma.TransactionClient | PrismaClient = prisma,
) => {
	await db.lineStagingGroup.delete({
		where: { groupId_hash },
	});
};
