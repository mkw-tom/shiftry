import type {
	StoreLite,
	UserLite,
	UserStoreLite,
} from "../../common/types/prismaLite.js";

import type { UserRole, UserStore } from "../../common/types/prisma.js";

export interface RegisterOwnerResponse {
	ok: true;
	user: UserLite;
	store: StoreLite;
	userStore: { userId: string; storeId: string; role: UserRole };
}

export interface RegisterOwnerResponse {
	ok: true;
	user: UserLite;
	store: StoreLite;
	userStore: UserStoreLite;
	savedStoreCode: true;
}

export interface UpsertUserInput {
	name: string;
	pictureUrl?: string;
}

export interface UpsertUserRepositoryInputType {
	lineId_hash: string;
	lineId_enc: string;
	lineKeyVersion_hash: string;
	lineKeyVersion_enc: string;
	name: string;
	pictureUrl?: string;
}
