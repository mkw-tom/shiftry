import { z } from "zod";

export const changeUserRoleValidate = z.object({
	userId: z.string().uuid(),
	role: z.enum(["STAFF", "MANAGER"]), // ← OWNERは除外！
});

export type changeUserRoleInputType = z.infer<typeof changeUserRoleValidate>;
