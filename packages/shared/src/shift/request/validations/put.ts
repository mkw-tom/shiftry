import { z } from "zod";
import { RequestStatus, ShiftType } from "../../../common/types/prisma";

const TimeSlot = z.string().regex(/^\d{2}:\d{2}-\d{2}:\d{2}\*\d+$/, {
	message: "Time must be in format HH:MM-HH:MM*X",
});
const DefaultTimePositionsSchema = z.object({
	Monday: z.array(TimeSlot),
	Tuesday: z.array(TimeSlot),
	Wednesday: z.array(TimeSlot),
	Thursday: z.array(TimeSlot),
	Friday: z.array(TimeSlot),
	Saturday: z.array(TimeSlot),
	Sunday: z.array(TimeSlot),
});
export type DefaultTimePositionsType = z.infer<
	typeof DefaultTimePositionsSchema
>;

const OverrideDatesSchema = z.record(
	z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/), // YYYY-MM-DD形式
	z.array(TimeSlot),
);
export type OverrideDatesType = z.infer<typeof OverrideDatesSchema>;

export const ShiftsOfRequestsValidate = z.object({
	defaultTimePositions: DefaultTimePositionsSchema,
	overrideDates: OverrideDatesSchema,
});
export type ShiftsOfRequestsType = z.infer<typeof ShiftsOfRequestsValidate>;

export const upsertShfitRequestValidate = z.object({
	weekStart: z.string().refine((val) => !Number.isNaN(Date.parse(val)), {
		message: "Invalid date format",
	}),
	weekEnd: z.string().refine((val) => !Number.isNaN(Date.parse(val)), {
		message: "Invalid date format",
	}),
	type: z.nativeEnum(ShiftType, {
		errorMap: () => ({ message: "Invalid shift type" }),
	}),
	requests: ShiftsOfRequestsValidate,
	status: z.nativeEnum(RequestStatus, {
		errorMap: () => ({ message: "Invalid status" }),
	}),
	deadline: z.string().refine((val) => !Number.isNaN(Date.parse(val)), {
		message: "Invalid date format",
	}),
});

export type UpsertShiftRequetType = z.infer<typeof upsertShfitRequestValidate>;
