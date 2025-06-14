import { z } from "zod";

// validations/payment.validation.ts
export const createPaymentValidate = z.object({
	productId: z.string().min(1, "productId is required").max(100),
	email: z.string().email().max(100),
	name: z.string().min(1).max(9),
	paymentMethodId: z.string().min(1),
});
export type createPaymentType = z.infer<typeof createPaymentValidate>;

export const productIdValidate = z.object({
	productId: z.string().min(1, "productId is required").max(100),
});
export type productIdType = z.infer<typeof productIdValidate>;
