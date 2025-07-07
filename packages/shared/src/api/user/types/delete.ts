import type { User } from "../../common/types/prisma";

export interface DeleteUserResponse {
	ok: true;
	deletedUser: User;
}
