import type {
	Store,
	User,
	UserRole,
	UserStore,
} from "../../common/types/prisma.js";

export interface RegisterStaffResponse {
	ok: true;
	user: { id: string; name: string };
	store: { id: string; name: string; isActive: boolean };
	userStore: { userId: string; storeId: string; role: UserRole };
}

export interface RegisterStaffServiceResponse {
	user: { id: string; name: string };
	store: { id: string; name: string; isActive: boolean };
	userStore: { userId: string; storeId: string; role: UserRole };
}

export interface UpsertUserInput {
	lineId: string;
	name: string;
	pictureUrl?: string;
	role: UserRole;
}
