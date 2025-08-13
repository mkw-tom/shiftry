import { getUserStoreByUserIdAndStoreId } from "../../../repositories/userStore.repository.js";

export const selectStoreLoginService = async (uid: string, groupId: string) => {
	const store = await getUserStoreByUserIdAndStoreId(uid, groupId);

	if (!store) {
		throw new Error("Store not found for the user in the specified group");
	}

	return store;
};
