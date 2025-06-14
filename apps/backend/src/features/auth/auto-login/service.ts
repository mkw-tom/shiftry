import type { AutoLoginServiceResponse } from "@shared/auth/types/auto-login";
import { getShiftRequestByStoreId } from "../../../repositories/shiftRequest.repository";
import { getStoreById } from "../../../repositories/store.repository";
import { getUserById } from "../../../repositories/user.repository";

const autoLogin = async (
	userId: string,
	storeId: string,
): Promise<AutoLoginServiceResponse> => {
	const user = await getUserById(userId);
	const store = await getStoreById(storeId);
	const shiftRequests = await getShiftRequestByStoreId(storeId);
	return { user, store, shiftRequests };
};

export default autoLogin;
