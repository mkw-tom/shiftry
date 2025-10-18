import { z } from "zod";
import { ShiftOfAssignValidate } from "./validations/put.js";

const ShiftStatusEnum = z.enum(["ADJUSTMENT", "CONFIRMED"]);

export const AssignShiftDTOValidate = z.object({
	id: z.string(),
	storeId: z.string(),
	shiftRequestId: z.string(),
	shifts: ShiftOfAssignValidate,
	status: ShiftStatusEnum,
	updatedAt: z.coerce.date(),
	createdAt: z.coerce.date(),
});
export type AssignShiftDTO = z.infer<typeof AssignShiftDTOValidate>;
