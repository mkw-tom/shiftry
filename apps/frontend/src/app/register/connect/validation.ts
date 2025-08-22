import { StoreCodeValidate } from "@shared/api/store/validations/connect-line-group";
import z from "zod";

export const connectFormValidate = z.object({
	storeCode: StoreCodeValidate,
	agree: z.literal(true, {
		errorMap: () => ({ message: "同意が必要です" }),
	}),
});
export type connectFormType = z.infer<typeof connectFormValidate>;
