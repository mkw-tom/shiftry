import { z } from "zod";

export const regiserOwnerAndStoreValidate = z.object({
	name: z
		.string()
		.min(1, "必須入力です")
		.max(10, "20文字以内で入力してください")
		.regex(/^[ぁ-んァ-ンー\s]*$/, "ひらがな or カタカナで入力してください"),
	storeName: z
		.string()
		.min(1, "必須入力です")
		.max(20, "20文字以内で入力してください"),
});

export type regiserOwnerAndStoreType = z.infer<
	typeof regiserOwnerAndStoreValidate
>;
