import type { LoginResponse } from "@shared/api/auth/types/login.js";
import { getUserById } from "../../../repositories/user.repository.js";
import { getStoresFromUser } from "../../../repositories/userStore.repository.js";
import { signAppJwt } from "../../../utils/jwt.js";

export const loginService = async (uid: string): Promise<LoginResponse> => {
	const user = await getUserById(uid);
	if (!user) throw new Error("User not found");

	const links = await getStoresFromUser(uid);
	if (!links || links.length === 0) {
		throw new Error("No stores found for user");
	}

	if (links.length === 1) {
		const only = links[0];
		const token = signAppJwt({
			uid: user.id,
			sid: only.store.id,
			role: only.role,
		});
		return { ok: true, kind: "AUTO", token: token };
	}

	return { ok: true, kind: "SELECT_STORE", stores: links };
};
