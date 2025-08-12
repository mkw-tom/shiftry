import type { Store, User, UserStore } from "../../common/types/prisma.js";

export interface AddManageStoreResponse {
	ok: true;
	user: User;
	store: { id: string; name: string };
	userStore: UserStore;
	user_token: string;
	store_token: string;
}
