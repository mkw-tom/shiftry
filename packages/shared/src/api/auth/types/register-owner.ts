import type { StoreLite, UserLite } from "../../common/types/prismaLite.js";

import type { UserRole, UserStore } from "../../common/types/prisma.js";

export interface RegisterOwnerResponse {
	ok: true;
	user: UserLite;
	store: StoreLite;
	userStore: { userId: string; storeId: string; role: UserRole };
}

export interface RegisterOwnerServiceResponse {
	user: UserLite;
	store: StoreLite;
	userStore: UserStore;
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
