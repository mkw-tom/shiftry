import type { UserRole } from "../../common/types/prisma.js";
import type {
	StoreLite,
	UserLite,
	UserStoreLite,
} from "../../common/types/prismaLite.js";

export interface RegisterStaffResponse {
	ok: true;
	user: UserLite;
	store: StoreLite;
	userStore: UserStoreLite;
}

export interface RegisterStaffServiceResponse {
	user: UserLite;
	store: StoreLite;
	userStore: UserStoreLite;
}

export interface UpsertUserInput {
	lineId: string;
	name: string;
	pictureUrl?: string;
	role: UserRole;
}
