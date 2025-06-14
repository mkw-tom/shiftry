import type { Store } from "../../common/types/prisma";

export interface GetStoresFromUserResponse {
	ok: true;
	stores: Store[];
}
