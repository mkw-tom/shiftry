import { userInputValidate } from "@shared/api/auth/validations/register-staff";
import { StoreCodeValidate } from "@shared/api/store/validations/connect-line-group";
import { z } from "zod";

export const RegisterStaffFormValidate = z.object({
  name: userInputValidate.shape.name,
  storeCode: StoreCodeValidate,
  agree: z.literal(true, {
    errorMap: () => ({ message: "同意が必要です" }),
  }),
});
export type RegisterStaffFormType = z.infer<typeof RegisterStaffFormValidate>;
