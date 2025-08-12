import prisma from "../../../../../config/database.js";
import { hmac } from "../../../../../lib/env.js";
import { hmacSha256 } from "../../../../../utils/hmac.js";

export async function findUserByLineSub(lineSub: string) {
	const userHash = hmacSha256(lineSub, hmac.saltLineId);
	return prisma.user.findUnique({
		where: { lineId_hash: userHash },
		select: { id: true, role: true },
	});
}
