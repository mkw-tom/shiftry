import type { InitServiceResponse } from "@shared/api/auth/types/init.js";
import { getActiveShiftRequests } from "../../../repositories/shiftRequest.repository.js";
import { getStoreById } from "../../../repositories/store.repository.js";
import { getUserById } from "../../../repositories/user.repository.js";

const Init = async (
	userId: string,
	storeId: string,
): Promise<InitServiceResponse> => {
	const [user, store, shiftRequests] = await Promise.all([
		getUserById(userId),
		getStoreById(storeId),
		getActiveShiftRequests(storeId),
	]);
	if (!user || !store) {
		throw new Error("data is not found");
	}

	return { user, store, shiftRequests };
};

export default Init;
