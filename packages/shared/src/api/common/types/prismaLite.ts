import type {
	JobRole,
	Store,
	StoreCode,
	User,
	UserJobRole,
	UserStore,
} from "./prisma.js";

// ----- 基本の Lite 型 -----
export type UserLite = Pick<User, "id" | "name" | "pictureUrl">;
export type StoreLite = Pick<Store, "id" | "name" | "isActive">;
export type UserStoreLite = Pick<UserStore, "userId" | "storeId" | "role">;

export type JobRoleLite = Pick<JobRole, "id" | "name">;
export type StoreCodeLite = Pick<
	StoreCode,
	"storeId" | "code_enc" | "codeKeyVersion_enc" | "codeKeyVersion_hash"
>;

export type UserStoreLiteWithStore = UserStoreLite & {
	store: StoreLite;
};
export type UserStoreLiteWithUserAndJobRoles = UserStoreLite & {
	user: UserLite & { jobRoles: { roleId: string; role: JobRoleLite }[] };
};

export type Member = Pick<UserStoreLiteWithUserAndJobRoles, "user" | "role">