import type { UserRole, UserStore } from "@shared/api/common/types/prisma.js";

export const mockUserStore = (
	userId: string,
	storeId: string,
	role: UserRole,
): UserStore => ({
	userId: userId,
	storeId: storeId,
	role: role,
});
