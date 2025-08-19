import { z } from "zod";

export const userInputValidate = z.object({
	name: z
		.string()
		.trim()
		.min(1, "必須入力です")
		.max(10, "20文字以内で入力してください"),
	pictureUrl: z.string().url().optional(),
});
export type userInputType = z.infer<typeof userInputValidate>;

export const storeInputValidate = z.object({
	name: z
		.string()
		.trim()
		.min(1, "必須入力です")
		.max(20, "20文字以内で入力してください"),
});
export type StoreNameType = z.infer<typeof storeInputValidate>;
