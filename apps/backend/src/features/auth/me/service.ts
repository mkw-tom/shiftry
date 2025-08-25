import type { AuthMeResponse } from "@shared/api/auth/types/me.js";
import type { ErrorResponse } from "@shared/api/common/types/errors.js";
import { UserRole } from "@shared/api/common/types/prisma.js";
import {
	getActiveShiftRequests,
	getShiftRequestByStoreId,
} from "../../../repositories/shiftRequest.repository.js";
import { getStoreById } from "../../../repositories/store.repository.js";
import { getUserById } from "../../../repositories/user.repository.js";
import {
	getMemberFromStore,
	getUserStoreByUserIdAndStoreId,
} from "../../../repositories/userStore.repository.js";
export const AuthMeService = async (
	uid: string,
	sid: string,
): Promise<AuthMeResponse | ErrorResponse> => {
	if (!uid || !sid) {
		throw new Error("Invalid parameters");
	}

	const [user, store, userStore, members] = await Promise.all([
		getUserById(uid),
		getStoreById(sid),
		getUserStoreByUserIdAndStoreId(uid, sid),
		getMemberFromStore(sid),
	]);

	if (!user) return { ok: false, message: "User not found" };
	if (!store) return { ok: false, message: "Store not found" };
	if (!userStore) return { ok: false, message: "Forbidden" };

	const shiftRequest = await getActiveShiftRequests(sid);

	return {
		ok: true,
		user: user,
		store: store,
		role: userStore?.role,
		members: members,
		ActiveShiftRequests: shiftRequest,
	};
};
