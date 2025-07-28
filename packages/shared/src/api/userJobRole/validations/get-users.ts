import z from "zod";

export const getUserJobRoleWithUsersValidate = z.object({
	roleIds: z.array(
		z.string().cuid({
			message: "Role ID must be a valid CUID",
		}),
	),
});
