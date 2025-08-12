import type { Store } from "../../common/types/prisma.js";

export interface GetStoresFromUserResponse {
	ok: true;
	stores: Store[];
}
