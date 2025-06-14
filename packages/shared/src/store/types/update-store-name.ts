import type { Store } from "../../common/types/prisma";

export interface UpdateStoreNameResponse {
	ok: true;
	store: Store;
}
