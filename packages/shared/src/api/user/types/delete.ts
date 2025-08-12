import type { User } from "../../common/types/prisma.js";

export interface DeleteUserResponse {
	ok: true;
	deletedUser: User;
}
