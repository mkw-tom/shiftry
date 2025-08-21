import type { StoreLite } from "../../common/types/prismaLite.js";

export interface StoreConnectLineGroupResponse {
	ok: true;
	store: StoreLite;
	kind: "ALREADY_LINKED" | "LINKED";
}
