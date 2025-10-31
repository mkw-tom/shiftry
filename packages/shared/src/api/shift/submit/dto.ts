import { z } from "zod";
import { SubmittedDataValidate } from "./validations/put.js";

const ShiftStatusEnum = z.enum(["ADJUSTMENT", "CONFIRMED"]);

export const SubmittedShiftDTOValidate = z.object({
	status: ShiftStatusEnum,
	id: z.string(),
	memo: z.string().nullable(),
	shiftRequestId: z.string(),
	shifts: SubmittedDataValidate,
	weekMin: z.number().int().min(1).max(7),
	weekMax: z.number().int().min(1).max(7),
	userId: z.string(),
	storeId: z.string(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
});

export type SubmittedShiftDTO = z.infer<typeof SubmittedShiftDTOValidate>;
