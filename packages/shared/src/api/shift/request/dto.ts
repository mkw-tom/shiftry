import { z } from "zod";
import { RequestsValidate } from "./validations/put.js";

// PrismaのEnum型をZodで再現
const ShiftTypeEnum = z.enum(["MONTHLY", "WEEKLY"]);
const RequestStatusEnum = z.enum([
	"HOLD",
	"REQUEST",
	"ADJUSTMENT",
	"CONFIRMED",
]);

export const ShiftRequestDTOValidate = z.object({
	type: ShiftTypeEnum,
	status: RequestStatusEnum,
	id: z.string(),
	storeId: z.string(),
	weekStart: z.coerce.date(),
	weekEnd: z.coerce.date(),
	requests: RequestsValidate,
	deadline: z.coerce.date().nullable(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
});
export type ShiftRequestDTO = z.infer<typeof ShiftRequestDTOValidate>;
