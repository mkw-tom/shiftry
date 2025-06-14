import { z } from "zod";

export const updateUserProlfileValidate = z.object({
	name: z.string().min(1, { message: "name is required" }).max(20),
	pictureUrl: z.string().url().optional(),
});
export type UpdateUserProlfileType = z.infer<typeof updateUserProlfileValidate>;

export const changeUserRoleValidate = z.object({
	userId: z.string().uuid(),
	role: z.enum(["STAFF", "MANAGER"]),
});

export type ChangeUserRoleType = z.infer<typeof changeUserRoleValidate>;
