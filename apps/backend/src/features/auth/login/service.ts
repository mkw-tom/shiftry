import type { LoginResType } from "@shared/api/auth/types/login.js";
import type { Store, User, UserRole } from "@shared/api/common/types/prisma.js";
import type {
	StoreLite,
	UserLite,
	UserStoreLiteWithStore,
} from "@shared/api/common/types/prismaLite.js";
import { getStoreById } from "../../../repositories/store.repository.js";
import { getUserById } from "../../../repositories/user.repository.js";
import {
	getStoreFromUser,
	getUserStoreByUserIdAndStoreId,
} from "../../../repositories/userStore.repository.js";

export const loginService = async (
	uid: string,
	sid?: string | null,
): Promise<LoginResType> => {
	const user = await getUserById(uid);
	if (!user) return { kind: "UNREGISTERED" };

	if (sid) {
		const userStore = await getUserStoreByUserIdAndStoreId(uid, sid);
		if (!userStore) return { kind: "STORE_FORBIDDEN" };

		const storeFull = await getStoreById(sid);
		if (!storeFull) return { kind: "NO_STORES" };

		const store: StoreLite = {
			id: storeFull.id,
			name: storeFull.name,
			isActive: storeFull.isActive,
		};
		return { kind: "AUTO", user, store, role: userStore.role };
	}

	const links = await getStoreFromUser(uid);
	if (!links || links.length === 0) return { kind: "NO_STORES" };

	if (links.length === 1) {
		const only = links[0];
		return { kind: "AUTO", user, store: only.store, role: only.role };
	}

	return { kind: "SELECT_STORE", user, stores: links };
};
