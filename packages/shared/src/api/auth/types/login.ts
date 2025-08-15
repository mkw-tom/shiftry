import type { Store, User, UserRole } from "../../common/types/prisma.js";
import type {
	StoreLite,
	UserLite,
	UserStoreLiteWithStore,
} from "../../common/types/prismaLite.js";

export type LoginResponseAuto = {
	kind: "AUTO";
	user: UserLite;
	store: StoreLite;
	role: UserRole;
};

export type LoginResponseSelectStore = {
	kind: "SELECT_STORE";
	user: UserLite;
	stores: UserStoreLiteWithStore[];
};

export type LoginResponseError = {
	ok: false;
	code: string;
	message: string;
};
export type LoginControllerResponse =
	| (LoginResponseAuto & { ok: boolean; session?: { access: string } })
	| (LoginResponseSelectStore & { ok: boolean })
	| LoginResponseError;

export type LoginResType =
	| LoginResponseAuto
	| LoginResponseSelectStore
	| { kind: "NO_STORES" }
	| { kind: "UNREGISTERED" }
	| { kind: "STORE_FORBIDDEN" };

export type NextKind =
	| { next: "AUTO"; storeId: string }
	| { next: "SELECT_STORE" };
