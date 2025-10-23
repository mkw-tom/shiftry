// import prisma from "../../../../../config/database.js";
// import lineBot from "../../../../../config/line.js";
// import { aes, hmac } from "../../../../../lib/env.js";
// import { createLineStagingGroup } from "../../../../../repositories/lineStagingGroup.js";
// import { crateLineStagingMember } from "../../../../../repositories/lineStagingMember.js";
// import { encryptText } from "../../../../../utils/aes.js";
// import { hmacSha256 } from "../../../../../utils/hmac.js";
// import { verifyIdToken } from "../../../../common/liff.service.js";

// export const createStagingData = async (groupId: string) => {
// 	try {
// 		const groupId_hash = hmacSha256(groupId, hmac.saltGroupId);
// 		const groupId_enc = encryptText(
// 			groupId,
// 			aes.keyGroupId,
// 			aes.keyVersionGroupId,
// 		);
// 		const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

// 		return await prisma.$transaction(async (tx) => {
// 			// 1) ステージング・グループ作成（upsertでもOK）
// 			const lineStagingGroup = await createLineStagingGroup(tx, {
// 				groupId_hash,
// 				groupId_enc,
// 				groupKeyVersion_enc: aes.keyVersionGroupId,
// 				groupKeyVersion_hash: hmac.keyVersionGroupId,
// 				expiresAt,
// 			});

// 			let start: string | undefined = undefined;

// 			do {
// 				const idsRes = await lineBot.getGroupMembersIds(groupId, start);
// 				const userIds = idsRes.memberIds ?? [];
// 				start = idsRes.next ?? undefined;

// 				for (const uid of userIds) {
// 					// 2) プロフィール取得
// 					const prof = await lineBot.getGroupMemberProfile(groupId, uid);

// 					// 3) userId をそのまま暗号・ハッシュ（IDトークン検証は不要）
// 					const lineId_hash = hmacSha256(uid, hmac.saltLineId);
// 					const lineId_enc = encryptText(
// 						uid,
// 						aes.keyLineId,
// 						aes.keyVersionLineId,
// 					);

// 					// 4) 既存チェック（重複回避）
// 					const exists = await tx.lineStagingMember.findFirst({
// 						where: { stagingGroupId: lineStagingGroup.id, lineId_hash },
// 						select: { id: true },
// 					});
// 					if (exists) continue;

// 					// 5) 1回だけ作成（2重insertしない）
// 					await tx.lineStagingMember.create({
// 						data: {
// 							stagingGroupId: lineStagingGroup.id,
// 							lineId_hash,
// 							lineId_enc,
// 							lineKeyVersion_enc: aes.keyVersionLineId,
// 							lineKeyVersion_hash: hmac.keyVersionLineId,
// 							name: prof.displayName ?? "",
// 							pictureUrl: prof.pictureUrl ?? null, // バリデーションがURL必須なら null/空文字の扱いに注意
// 						},
// 					});
// 				}
// 			} while (start);

// 			return { ok: true, groupId_hash, createdGroupId: lineStagingGroup.id };
// 		});
// 	} catch (error) {
// 		console.error("❌ Staging data creation error:", error);
// 		return { ok: false, message: "Staging data creation failed" };
// 	}
// };
