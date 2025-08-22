import {
	storeInputValidate,
	userInputValidate,
} from "@shared/api/auth/validations/register-owner";
import { z } from "zod";

export const regiserOwnerValidate = z.object({
	name: userInputValidate.shape.name,
	storeName: storeInputValidate.shape.name,
	agree: z.literal(true, {
		errorMap: () => ({ message: "同意が必要です" }),
	}),
});

export type regiserOwnerAndStoreType = z.infer<typeof regiserOwnerValidate>;

// export const checkBoxValidate = z.object({
//   agree: z.literal(true, {
//     errorMap: () => ({ message: "同意が必要です" }),
//   }),
// });
// export type CheckBoxType = z.infer<typeof checkBoxValidate>;
