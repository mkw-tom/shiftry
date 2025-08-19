import z from "zod";

export const checkBoxValidate = z.object({
	agree: z.literal(true, {
		errorMap: () => ({ message: "同意が必要です" }),
	}),
});
export type CheckBoxType = z.infer<typeof checkBoxValidate>;
