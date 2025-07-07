import { z } from "zod";

export const productIdValidate = z.object({
	productId: z.string().min(1, "productId is required").max(100),
});
export type productIdType = z.infer<typeof productIdValidate>;
