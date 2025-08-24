import { z } from "zod";
import { RequestStatus, ShiftType } from "../../../common/types/prisma.js";

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
  z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // YYYY-MM-DD形式
  z.array(TimeSlot)
);
export type OverrideDatesType = z.infer<typeof OverrideDatesSchema>;

export const ShiftsOfRequestsValidate = z.object({
  defaultTimePositions: DefaultTimePositionsSchema,
  overrideDates: OverrideDatesSchema,
});
export type ShiftsOfRequestsType = z.infer<typeof ShiftsOfRequestsValidate>;

// ユーザー情報のスキーマ
export const AbsoluteUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  pictureUrl: z.string().optional(),
});
export const priorityUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  pictureUrl: z.string().optional(),
  level: z
    .number()
    .int()
    .min(1, {
      message: "Level must be an integer greater than or equal to 1",
    })
    .max(3, {
      message: "Level must be an integer less than or equal to 3",
    }),
});
export type AbsoluteUserType = z.infer<typeof AbsoluteUserSchema>;

// 時間帯ごとの割り当て情報スキーマ
export const TimeSlotSchema = z.object({
  name: z.string(),
  count: z
    .number()
    .min(1, {
      message: "Count must be greater than or equal to 1",
    })
    .max(3, {
      message: "Count must be less than or equal to 3",
    }),
  absolute: z.array(AbsoluteUserSchema).default([]), // デフォルト空配列
  priority: z.array(priorityUserSchema).default([]), // デフォルト空配列
  jobRoles: z.array(z.string()).default([]), // デフォルト空配列
});
export type TimeSlotType = z.infer<typeof TimeSlotSchema>;

// 日付ごとのスキーマ（null も許容）
export const DateSchema = z.record(
  z.string(), // 例: "10:00-14:00"
  TimeSlotSchema
);
export type DateType = z.infer<typeof DateSchema>;

// 全体のスケジュールスキーマ
export const RequestCalendarValidate = z.record(
  z.string(), // 例: "2025-08-01"
  z.union([DateSchema, z.null()])
);

export type RequestCalendarType = z.infer<typeof RequestCalendarValidate>;

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
  requests: RequestCalendarValidate,
  status: z.nativeEnum(RequestStatus, {
    errorMap: () => ({ message: "Invalid status" }),
  }),
  deadline: z.string().refine((val) => !Number.isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
});

export type UpsertShiftRequetType = z.infer<typeof upsertShfitRequestValidate>;
