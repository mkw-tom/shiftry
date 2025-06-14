import type { Store, User } from "../../common/types/prisma";

export interface LoginResponse {
	ok: true;
	user_token: string;
	user: User;
	stores: Store[];
}
