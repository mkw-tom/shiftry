import { th } from "@faker-js/faker";
import type { SelectStoreResponse } from "@shared/api/auth/types/select-store.js";
import type { ErrorResponse } from "@shared/api/common/types/errors.js";
import { getStoreById } from "../../../repositories/store.repository.js";
import { getUserStoreByUserIdAndStoreId } from "../../../repositories/userStore.repository.js";
import { signAppJwt } from "../../../utils/jwt.js";

export const selectStoreLoginService = async (
	uid: string,
	storeId: string,
): Promise<SelectStoreResponse | ErrorResponse> => {
	const userStore = await getUserStoreByUserIdAndStoreId(uid, storeId);
	if (!userStore) {
		return { ok: false, message: "Store not found for user" };
	}

	const store = userStore.store ?? (await getStoreById(storeId));
	if (!store) {
		return { ok: false, message: "Store not found" };
	}

	const token = signAppJwt({
		uid,
		sid: userStore.storeId,
		role: userStore.role,
	});

	return {
		ok: true,
		token: token,
	};
};
