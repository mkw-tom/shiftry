import type { User } from "../../common/types/prisma";

export interface DeleteUserByOwnerResponse {
	ok: true;
	deleteStaff: User;
}
