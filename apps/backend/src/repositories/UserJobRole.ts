import type { UserJobRole } from "@shared/api/common/types/prisma";
import type { UserJobRoleWithUser } from "@shared/api/userJobRole/types/get-users";
import prisma from "../config/database";

const deleteManyUserJobRoles = async (userId: string, roleIds: string[]) => {
	return await prisma.userJobRole.deleteMany({
		where: {
			userId,
			roleId: { in: roleIds },
		},
	});
};

const upsertUserJobRole = async (
	userId: string,
	roleId: string,
): Promise<UserJobRole> => {
	return await prisma.userJobRole.upsert({
		where: { userId_roleId: { userId, roleId } },
		create: { userId, roleId },
		update: {},
	});
};

const upsertManyUserJobRoles = async (
	userId: string,
	roleIds: string[],
): Promise<UserJobRole[]> => {
	return await Promise.all(
		roleIds.map((roleId) => upsertUserJobRole(userId, roleId)),
	);
};

// メイン同期関数
export const BulkUpsertUserJobRoles = async (
	userId: string,
	roleIds: string[],
) => {
	// 現在登録済みの userRole を取得
	const existing = await prisma.userJobRole.findMany({
		where: { userId },
		select: { roleId: true },
	});

	const keepSet = new Set(roleIds);
	const toDelete = existing.map((e) => e.roleId).filter((r) => !keepSet.has(r));

	// 不要なロールを削除
	await deleteManyUserJobRoles(userId, toDelete);

	// 必要なロールを Upsert
	return await upsertManyUserJobRoles(userId, roleIds);
};

export const getUserJobRoleWithUsers = async (
	roleIds: string[],
): Promise<UserJobRoleWithUser[]> => {
	return await prisma.userJobRole.findMany({
		where: {
			roleId: { in: roleIds },
		},
		include: {
			user: {
				select: {
					id: true,
					name: true,
					jobRoles: {
						select: {
							roleId: true,
							role: {
								select: {
									id: true,
									name: true,
								},
							},
						},
					},
				},
			},
		},
	});
};
