import type { User, UserStore } from "../../common/types/prisma.js";

export interface ChangeUserRoleResponse {
	ok: true;
	user: User;
	userStore: UserStore;
}

export interface ChangeUserRoleServiceResponse {
	user: User;
	userStore: UserStore;
}
