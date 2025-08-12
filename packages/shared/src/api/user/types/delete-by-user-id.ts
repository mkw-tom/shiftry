import type { User } from "../../common/types/prisma.js";

export interface DeleteUserByOwnerResponse {
	ok: true;
	deleteStaff: User;
}
