import type { UserRole } from "@shared/api/common/types/prisma.js";
import type { UserStoreLite } from "@shared/api/common/types/prismaLite.js";

export const mockUserStore = (
	userId: string,
	storeId: string,
	role: UserRole,
): UserStoreLite => ({
	userId: userId,
	storeId: storeId,
	role: role,
});
