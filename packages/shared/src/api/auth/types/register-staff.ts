import type {
	Store,
	User,
	UserRole,
	UserStore,
} from "../../common/types/prisma";

export interface RegisterStaffResponse {
	ok: true;
	user: User;
	store: Store;
	userStore: UserStore;
	user_token: string;
	store_token: string;
	group_token: string;
}

export interface RegisterStaffServiceResponse {
	user: User;
	store: Store;
	userStore: UserStore;
}

export interface UpsertUserInput {
	lineId: string;
	name: string;
	pictureUrl?: string;
	role: UserRole;
}
