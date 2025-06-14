import { z } from "zod";
import { ShiftStatus } from "../../../common/types/prisma";

export const shiftAssignEntrySchema = z.object({
	userId: z.string().uuid(),
	userName: z.string(),
	shifts: z.array(
		z.object({
			date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
			time: z.string(), // 例: "09:00-13:00"
		}),
	),
});

export const shiftsOfAssignValidate = z.array(shiftAssignEntrySchema);
export type ShiftsOfAssignType = z.infer<typeof shiftsOfAssignValidate>;

export const upsertAssignShfitValidate = z.object({
	shiftRequestId: z.string().uuid(),
	shifts: shiftsOfAssignValidate,
	status: z.nativeEnum(ShiftStatus, {
		errorMap: () => ({ message: "Invalid status" }),
	}),
});
export type upsertAssignShfitInputType = z.infer<
	typeof upsertAssignShfitValidate
>;
