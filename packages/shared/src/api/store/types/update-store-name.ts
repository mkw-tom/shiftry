import type { Store } from "../../common/types/prisma.js";

export interface UpdateStoreNameResponse {
	ok: true;
	store: Store;
}
