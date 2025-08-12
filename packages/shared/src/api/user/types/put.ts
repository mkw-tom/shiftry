import type { User } from "../../common/types/prisma.js";

export interface UpdateUserProfileResponse {
	ok: true;
	updatedUser: User;
}
