import z from "zod";

export const BulkUpsertUserJobRolesValidate = z.object({
	staffUserId: z.string().uuid({
		message: "Invalid staffUserId format",
	}),
	roleIds: z.array(
		z.string().cuid({
			message: "Role ID must be a valid CUID",
		}),
	),
});
