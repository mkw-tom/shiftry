import type { Store, User, UserStore } from "../../common/types/prisma";

export interface AddManageStoreResponse {
	ok: true;
	user: User;
	store: Store;
	userStore: UserStore;
	user_token: string;
	store_token: string;
}
