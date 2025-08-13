import type { Store, User, UserStore } from "./prisma.js";

export type UserLite = Pick<User, "id" | "name" | "pictureUrl">;
export type StoreLite = Pick<Store, "id" | "name" | "isActive">;

export type UserStoreLiteWithStore = Pick<
	UserStore,
	"userId" | "storeId" | "role"
> & {
	store: Pick<Store, "id" | "name" | "isActive">;
};

export type UserStoreLite = Pick<UserStore, "userId" | "storeId" | "role">;
