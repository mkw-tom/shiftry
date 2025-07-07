import { z } from "zod";

export const updateUserProlfileValidate = z.object({
	name: z.string().min(1, { message: "name is required" }).max(20),
	pictureUrl: z.string().url().optional(),
});
export type updateUserProlfileType = z.infer<typeof updateUserProlfileValidate>;
