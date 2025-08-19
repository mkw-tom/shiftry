import type { UserStoreLiteWithStore } from "../../common/types/prismaLite.js";

export type GetUnconnectedStoresMeResponse = {
	ok: true;
	unconnectedStores: UserStoreLiteWithStore[];
};
