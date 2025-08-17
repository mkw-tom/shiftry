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
	agree: z.literal(true, {
		errorMap: () => ({ message: "同意が必要です" }),
	}),
});

export type regiserOwnerAndStoreType = z.infer<
	typeof regiserOwnerAndStoreValidate
>;

// export const checkBoxValidate = z.object({
//   agree: z.literal(true, {
//     errorMap: () => ({ message: "同意が必要です" }),
//   }),
// });
// export type CheckBoxType = z.infer<typeof checkBoxValidate>;
