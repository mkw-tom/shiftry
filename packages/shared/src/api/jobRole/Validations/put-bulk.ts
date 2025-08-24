import z from "zod";

export const putBulkJobRoleValidate = z.object({
	names: z.array(
		z.string().min(1, {
			message: "Name must be a non-empty string",
		}),
	),
});
export type PutBulkJobRoleType = z.infer<typeof putBulkJobRoleValidate>;
