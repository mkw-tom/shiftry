import { z } from "zod";

export const createPaymentValidate = z.object({
	productId: z.string().min(1, "productId is required").max(100),
	email: z.string().email().max(100),
	paymentMethodId: z.string().min(1),
});
export type createPaymentType = z.infer<typeof createPaymentValidate>;
