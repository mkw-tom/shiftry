import type { User } from "../../common/types/prisma";

export interface UpdateUserProfileResponse {
	ok: true;
	updatedUser: User;
}
