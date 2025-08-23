import type { UserStoreLiteWithStore } from "../../../api/common/types/prismaLite.js";

export interface GetStoresFromUserResponse {
	ok: true;
	stores: UserStoreLiteWithStore[];
}
