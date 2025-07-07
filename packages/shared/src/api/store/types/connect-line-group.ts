import type { Store } from "../../common/types/prisma";

export interface StoreConnectLineGroupResponse {
	ok: true;
	store: Store;
	group_token: string;
}
