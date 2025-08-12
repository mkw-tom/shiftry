import type { AutoLoginServiceResponse } from "@shared/api/auth/types/auto-login.js";
import { getActiveShiftRequests } from "../../../repositories/shiftRequest.repository.js";
import { getStoreById } from "../../../repositories/store.repository.js";
import { getUserById } from "../../../repositories/user.repository.js";

const autoLogin = async (
	userId: string,
	storeId: string,
): Promise<AutoLoginServiceResponse> => {
	const user = await getUserById(userId);
	const store = await getStoreById(storeId);
	const shiftRequests = await getActiveShiftRequests(storeId);
	return { user, store, shiftRequests };
};

export default autoLogin;
