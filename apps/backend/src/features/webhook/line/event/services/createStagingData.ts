import prisma from "../../../../../config/database.js";
import lineBot from "../../../../../config/line.js";
import { aes, hmac } from "../../../../../lib/env.js";
import { createLineStagingGroup } from "../../../../../repositories/lineStagingGroup.js";
import { crateLineStagingMember } from "../../../../../repositories/lineStagingMember.js";
import { encryptText } from "../../../../../utils/aes.js";
import { hmacSha256 } from "../../../../../utils/hmac.js";
import { verifyIdToken } from "../../../../common/liff.service.js";

export const createStagingData = async (groupId: string) => {
	try {
		const groupId_hash = hmacSha256(groupId, hmac.saltGroupId);
		const groupId_enc = encryptText(
			groupId,
			aes.keyGroupId,
			aes.keyVersionGroupId,
		);
		const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

		return await prisma.$transaction(async (tx) => {
			const groupData = {
				groupId_hash: groupId_hash,
				groupId_enc: groupId_enc,
				groupKeyVersion_enc: aes.keyVersionGroupId,
				groupKeyVersion_hash: hmac.keyVersionGroupId,
				expiresAt: expiresAt,
			};
			const lineStagingGroup = await createLineStagingGroup(tx, groupData);

			let start: string | undefined = undefined;

			do {
				const idsRes = await lineBot.getGroupMembersIds(groupId, start);
				const userIds = idsRes.memberIds ?? [];
				start = idsRes.next ?? undefined;
				for (const uid of userIds) {
					const prof = await lineBot.getGroupMemberProfile(groupId, uid);

					const sub = await verifyIdToken(uid);
					if (!sub)
						return { ok: false, message: "Invalid or missing ID token" };
					const lineHash = hmacSha256(sub, hmac.saltLineId);
					const lineEnc = encryptText(sub, aes.keyLineId, aes.keyVersionLineId);

					const memberData = {
						stagingGroupId: lineStagingGroup.id,
						lineId_hash: lineHash,
						lineId_enc: lineEnc,
						lineKeyVersion_enc: aes.keyVersionLineId,
						lineKeyVersion_hash: hmac.keyVersionLineId,
						name: prof.displayName,
						pictureUrl: prof.pictureUrl ?? "",
					};

					await crateLineStagingMember(tx, memberData);

					await tx.lineStagingMember.create({
						data: {
							stagingGroupId: lineStagingGroup.id,
							lineId_hash: lineHash,
							lineId_enc: lineEnc,
							lineKeyVersion_enc: aes.keyVersionLineId,
							lineKeyVersion_hash: hmac.keyVersionLineId,
							name: prof.displayName,
							pictureUrl: prof.pictureUrl,
						},
					});
				}
			} while (start);
		});
	} catch (error) {}
};
