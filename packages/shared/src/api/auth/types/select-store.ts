import type { UserRole } from "../../common/types/prisma.js";

type Ok = {
	ok: true;
	session: { access: string };
	store: { id: string; name: string; isActive: boolean };
	role: UserRole;
};
type Err =
	| { ok: false; code: "STORE_FORBIDDEN"; message: string }
	| { ok: false; code: "STORE_NOT_FOUND"; message: string };

export type SelectStoreResponse = Ok | Err;
