import { type Prisma, type PrismaClient, StoreCode } from "@prisma/client";
import type { StoreCodeLite } from "@shared/api/common/types/prismaLite.js";
import prisma from "../config/database.js";
import { aes, hmac } from "../lib/env.js";

export const UpsertStoreCode = async (
	storeId: string,
	code_hash: string,
	code_enc: string,
) => {
	const storeCode = await prisma.storeCode.upsert({
		where: { storeId: storeId },
		update: {
			code_hash: code_hash,
			code_enc: code_enc,
			codeKeyVersion_hash: hmac.keyVersionStoreCode,
			codeKeyVersion_enc: aes.keyVersionStoreCode,
			rotatedAt: new Date(),
		},
		create: {
			storeId: storeId,
			code_hash: code_hash,
			code_enc: code_enc,
			codeKeyVersion_hash: hmac.keyVersionStoreCode,
			codeKeyVersion_enc: aes.keyVersionStoreCode,
		},
	});
	return storeCode;
};

export const getStoreCodeByHash = async (
	code_hash: string,
	db: Prisma.TransactionClient | PrismaClient = prisma,
): Promise<StoreCodeLite | null> => {
	return await db.storeCode.findUnique({
		where: { code_hash: code_hash },
		select: {
			storeId: true,
			code_enc: true,
			codeKeyVersion_enc: true,
			codeKeyVersion_hash: true,
		},
	});
};
