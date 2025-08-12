import type { UserRole } from "../../../api/common/types/prisma.js";

export type CommitLiffUserResponse = {
	token: string;
	user: { id: string; role: UserRole };
	storeId: string | null;
};
