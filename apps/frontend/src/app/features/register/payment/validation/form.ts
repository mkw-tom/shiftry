import { createPaymentValidate } from "@shared/payment/validations/post";
import type { z } from "zod";

// export const emailValidate = z.object({
// 	email: z.string().email("正しいメールアドレスを入力してください").max(100),
// });
// export type emailType = z.infer<typeof emailValidate>;

export const emailValidate = createPaymentValidate.pick({ email: true });
export type emailType = z.infer<typeof emailValidate>;
