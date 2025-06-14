import { z } from "zod";

export const UserIdParamValidate = z.object({
	userId: z.string().uuid({
		message: "Invalid UserId format",
	}),
});
export type UserIdParamType = z.infer<typeof UserIdParamValidate>;
