import type { Store, User, UserStore } from "@shared/api/common/types/prisma";
import { getShiftRequestById } from "../../repositories/shiftRequest.repository";
import { getStoreById } from "../../repositories/store.repository";
import {
	getUserById,
	getUserByLineId,
} from "../../repositories/user.repository";
import { getUserStoreByUserIdAndStoreId } from "../../repositories/userStore.repository";

export const verifyUserStore = async (userId: string, storeId: string) => {
	const userStore = await getUserStoreByUserIdAndStoreId(userId, storeId);
	if (!userStore) {
		throw new Error("User is not authorized as OWNER");
	}
	return userStore;
};

export const verifyUserStoreForOwner = async (
	userId: string,
	storeId: string,
): Promise<UserStore> => {
	const userStore = await getUserStoreByUserIdAndStoreId(userId, storeId);
	if (!userStore) {
		throw new Error("User is not authorized");
	}
	if (userStore.role !== "OWNER") {
		throw new Error("User is not authorized as OWNER");
	}
	return userStore;
};

export const verifyUserStoreForOwnerAndManager = async (
	userId: string,
	storeId: string,
): Promise<UserStore> => {
	const userStore = await getUserStoreByUserIdAndStoreId(userId, storeId);
	if (!userStore) {
		throw new Error("User is not authorized ");
	}
	if (!userStore || userStore.role === "STAFF") {
		throw new Error("User is not authorized as Owner or Manager");
	}
	return userStore;
};

export const verifyUser = async (userId: string): Promise<User> => {
	const user = await getUserById(userId);
	if (!user) throw new Error("User not found");
	return user;
};

export const verifyUserByLineId = async (lineId: string): Promise<User> => {
	const user = await getUserByLineId(lineId);
	if (!user) throw new Error("User not found");
	return user;
};

export const verifyUserForOwner = async (userId: string): Promise<User> => {
	const user = await getUserById(userId);
	if (!user) {
		throw new Error("User is not authorized");
	}
	if (user.role !== "OWNER") throw new Error("User is not authorized as Owner");
	return user;
};

export const verifyStoreIdAndShiftRequestId = async (
	storeId: string,
	shiftRequestId: string,
): Promise<Store> => {
	const store = await getStoreById(storeId);
	const shiftRequest = await getShiftRequestById(shiftRequestId);
	if (store?.id !== shiftRequest?.storeId) {
		throw new Error("these data are unAuthorize ");
	}
	if (!store) {
		throw new Error("store is not found ");
	}

	return store;
};
