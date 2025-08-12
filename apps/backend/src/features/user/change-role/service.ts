import type { UserRole } from "@prisma/client";
import type { ChangeUserRoleServiceResponse } from "@shared/api/user/types/change-role.js";
import { changeUserRole } from "../../../repositories/user.repository.js";
import { changeUserRoleToUserStore } from "../../../repositories/userStore.repository.js";

/// ユーザーの権限変更（オーナーが操作）
export const changeUserRoleService = async (
	userId: string,
	storeId: string,
	role: UserRole,
): Promise<ChangeUserRoleServiceResponse> => {
	const [user, userStore] = await Promise.all([
		changeUserRole(userId, role),
		changeUserRoleToUserStore(userId, storeId, role),
	]);
	return { user, userStore };
};
