import type { Store, StoreCode, User, UserStore } from "./prisma.js";

export type UserLite = Pick<User, "id" | "name" | "pictureUrl">;
export type StoreLite = Pick<Store, "id" | "name" | "isActive">;

export type UserStoreLiteWithStore = Pick<
	UserStore,
	"userId" | "storeId" | "role"
> & {
	store: Pick<Store, "id" | "name" | "isActive">;
};

export type UserStoreLite = Pick<UserStore, "userId" | "storeId" | "role">;

export type StoreCodeLite = Pick<
	StoreCode,
	"storeId" | "code_enc" | "codeKeyVersion_enc" | "codeKeyVersion_hash"
>;
