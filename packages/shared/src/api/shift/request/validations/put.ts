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

// ユーザー情報のスキーマ
export const AbsoluteUserSchema = z.object({
	userId: z.string(),
	userName: z.string(),
});
export type AbsoluteUserType = z.infer<typeof AbsoluteUserSchema>;

// 時間帯ごとの割り当て情報スキーマ
export const TimeSlotSchema = z.object({
	count: z.number(),
	absolute: z.array(AbsoluteUserSchema).default([]), // デフォルト空配列
});
export type TimeSlotType = z.infer<typeof TimeSlotSchema>;

// 日付ごとのスキーマ（null も許容）
export const DateSchema = z.record(
	z.string(), // 例: "10:00-14:00"
	TimeSlotSchema,
);
export type DateType = z.infer<typeof DateSchema>;

// 全体のスケジュールスキーマ
export const RequestCalenderValidate = z.record(
	z.string(), // 例: "2025-08-01"
	z.union([DateSchema, z.null()]),
);

export type RequestCalenderType = z.infer<typeof RequestCalenderValidate>;

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

export type UpsertShiftRequestWithCalendar = Omit<
	UpsertShiftRequetType,
	"requests"
> & {
	requests: RequestCalenderType;
};
