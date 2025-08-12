import { aes, hmac } from "../../../lib/env.js";
import {
	connectStoreToGroup,
	findStoreByGroupHashExcept,
} from "../../../repositories/store.repository.js";
import { encryptText } from "../../../utils/aes.js";
import { hmacSha256 } from "../../../utils/hmac.js";
import { assertChannelValid } from "../../common/liff.service.js";

export async function connectStoreToGroupService(
	storeId: string,
	channelType: "utou" | "group" | "room",
	channelId: string,
) {
	if (channelType !== "group") {
		throw { status: 400, message: "Only group linking is supported" };
	}

	await assertChannelValid(channelType, channelId);

	const groupId_hash = hmacSha256(channelId, hmac.saltGroupId);
	const groupId_enc = encryptText(
		channelId,
		aes.keyGroupId,
		aes.keyVersionGroupId,
	);

	const dup = await findStoreByGroupHashExcept(groupId_hash, storeId);
	if (dup) {
		throw {
			status: 409,
			message: "This group is already linked to another store",
		};
	}

	try {
		const store = await connectStoreToGroup(
			storeId,
			groupId_hash,
			groupId_enc,
			hmac.keyVersionGroupId,
			aes.keyVersionGroupId,
		);
		return store;
	} catch (e) {
		if (
			typeof e === "object" &&
			e !== null &&
			"code" in e &&
			e.code === "P2002"
		) {
			throw {
				status: 409,
				message: "This group is already linked to another store",
			};
		}
		throw e;
	}
}
