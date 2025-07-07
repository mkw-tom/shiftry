import type { User } from "../../common/types/prisma";

export interface GetUsersFromStoreResponse {
	ok: true;
	storeUsers: User[];
}
