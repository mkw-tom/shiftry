import type {
	Store,
	User,
	UserRole,
	UserStore,
} from "../../common/types/prisma";

export interface RegisterOwnerResponse {
	ok: true;
	user: User;
	store: Store;
	userStore: UserStore;
	user_token: string;
	store_token: string;
}

export interface RegisterOwnerServiceResponse {
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
