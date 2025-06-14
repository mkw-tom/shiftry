import { z } from "zod";

export const updateStoreNameValidate = z.object({
	name: z.string().min(1, { message: "store name is required" }).max(20),
});
export type updateStoreNameInput = z.infer<typeof updateStoreNameValidate>;
