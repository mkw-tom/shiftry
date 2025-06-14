import type { UserRole } from "@prisma/client";
import type { ChangeUserRoleServiceResponse } from "@shared/user/types/change-role";
import { changeUserRole } from "../../../repositories/user.repository";
import { changeUserRoleToUserStore } from "../../../repositories/userStore.repository";

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
