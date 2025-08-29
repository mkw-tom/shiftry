import { z } from "zod";

export const putBulkJobRoleValidate = z.object({
	names: z
		.array(
			z
				.string()
				.trim()
				.min(1, {
					message: "業務名を入力してください",
				})
				.max(30, {
					message: "業務名は30文字以内で入力してください",
				}),
		)
		.min(1, { message: "少なくとも1つ以上の業務名を入力してください" })
		.transform((arr) => Array.from(new Set(arr.filter(Boolean)))), // 空文字削除＋重複排除
});

export type PutBulkJobRoleType = z.infer<typeof putBulkJobRoleValidate>;
