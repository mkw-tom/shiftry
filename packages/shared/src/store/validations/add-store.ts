import { z } from "zod";

export const storeNameValidate = z.object({
	name: z.string().min(1, { message: "store name is required" }).max(20),
});
export type StoreNameType = z.infer<typeof storeNameValidate>;
