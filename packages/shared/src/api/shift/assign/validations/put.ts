import { z } from "zod";
import { ShiftStatus } from "../../../common/types/prisma";

export const shiftsOfAssignValidate = z.object({
	userId: z.string().uuid(),
	userName: z.string(),
	jobRoles: z.array(z.string()).default([]), // デフォルト空配列
	shifts: z.array(
		z.object({
			date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
			time: z.string(), // 例: "09:00-13:00"
		}),
	),
});
export type ShiftsOfAssignType = z.infer<typeof shiftsOfAssignValidate>;

export const upsertAssignShfitValidate = z.object({
	shiftRequestId: z.string().uuid(),
	shifts: shiftsOfAssignValidate.array(),
	status: z.nativeEnum(ShiftStatus, {
		errorMap: () => ({ message: "Invalid status" }),
	}),
});
export type upsertAssignShfitInputType = z.infer<
	typeof upsertAssignShfitValidate
>;
