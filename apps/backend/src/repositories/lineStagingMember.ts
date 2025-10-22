import type { Prisma, PrismaClient } from "@prisma/client";
import prisma from "../config/database.js";

export const crateLineStagingMember = async (
	db: Prisma.TransactionClient | PrismaClient,
	data: {
		stagingGroupId: string;
		lineId_hash: string;
		lineId_enc: string;
		lineKeyVersion_enc: string;
		lineKeyVersion_hash: string;
		name: string;
		pictureUrl: string;
	},
) => {
	const lineStagingMember = await db.lineStagingMember.create({
		data,
	});
	return lineStagingMember;
};
