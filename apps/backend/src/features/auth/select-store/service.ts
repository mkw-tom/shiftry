import type { SelectStoreResponse } from "@shared/api/auth/types/select-store.js";
import { getStoreById } from "../../../repositories/store.repository.js";
import { getUserStoreByUserIdAndStoreId } from "../../../repositories/userStore.repository.js";
import { signAppJwt } from "../../../utils/jwt.js";

export const selectStoreLoginService = async (
	uid: string,
	storeId: string,
): Promise<SelectStoreResponse> => {
	const userStore = await getUserStoreByUserIdAndStoreId(uid, storeId);
	if (!userStore) {
		return {
			ok: false,
			code: "STORE_FORBIDDEN",
			message: "Store not linked to user",
		};
	}

	const store = userStore.store ?? (await getStoreById(storeId));
	if (!store) {
		return { ok: false, code: "STORE_NOT_FOUND", message: "Store not found" };
	}

	const access = signAppJwt({
		uid,
		sid: userStore.storeId,
		role: userStore.role,
	});

	return {
		ok: true,
		session: { access },
		store: { id: store.id, name: store.name, isActive: store.isActive },
		role: userStore.role,
	};
};
