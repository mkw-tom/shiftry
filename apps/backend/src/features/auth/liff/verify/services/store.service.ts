import prisma from "../../../../../config/database";
import { hmac } from "../../../../../lib/env";
import { hmacSha256 } from "../../../../../utils/hmac";

export async function findLinkedStoreIdByChannelId(channelId: string) {
	const chHash = hmacSha256(channelId, hmac.saltGroupId);
	const store = await prisma.store.findFirst({
		where: { groupId_hash: chHash, isActive: true },
		select: { id: true },
	});
	return store?.id; // undefined or string
}
