import prisma from "../../../../../config/database.js";
import { hmac } from "../../../../../lib/env.js";
import { hmacSha256 } from "../../../../../utils/hmac.js";

export async function findLinkedStoreIdByChannelId(channelId: string) {
	const chHash = hmacSha256(channelId, hmac.saltGroupId);
	const store = await prisma.store.findFirst({
		where: { groupId_hash: chHash, isActive: true },
		select: { id: true },
	});
	return store?.id; // undefined or string
}
