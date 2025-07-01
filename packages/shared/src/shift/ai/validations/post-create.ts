import z from "zod";
import {
  availableWeekValidate,
  specificDatesValidate,
} from "../../../shift/submit/validations/put";

//// shiftOfRequestsValidateに必要なバリデーション
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

/// shiftOfRequestsValidateのバリデーション
export const ShiftsOfRequestsValidate = z.object({
  defaultTimePositions: DefaultTimePositionsSchema,
  overrideDates: OverrideDatesSchema,
});
export type ShiftsOfRequestsType = z.infer<typeof ShiftsOfRequestsValidate>;

//// submittedShiftValidation に userId プロパティをマージ
export const shiftsOfSubmittedWithIdValidate = z.object({
  userId: z.string().uuid(),
  name: z
    .string()
    .min(1, "ニックネームは必須です")
    .max(20, "20文字以内で入力してください"),
  weekCountMin: z
    .number()
    .int()
    .min(0, "0〜7の間で指定してください")
    .max(7, "0〜7の間で指定してください"),
  weekCountMax: z
    .number()
    .int()
    .min(0, "0〜7の間で指定してください")
    .max(7, "0〜7の間で指定してください"),
  availableWeeks: z.array(availableWeekValidate).default([]),
  specificDates: z.array(specificDatesValidate).default([]),
});
export type shiftOfSubmittdWithUserId = z.infer<
  typeof shiftsOfSubmittedWithIdValidate
>;

//// 優先度データのバリデーション
export const priorityValidate = z.object({
  userId: z.string(),
  userName: z.string(),
  preferTime: z
    .union([
      z.enum(["morning", "afternoon"]),
      z.object({
        start: z.string(), // "09:00"
        end: z.string(), // "13:00"
      }),
    ])
    .optional(),
  preferredDays: z
    .array(
      z.enum([
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ])
    )
    .optional(),
  preferMoreThan: z
    .array(
      z.object({
        userId: z.string(),
        userName: z.string(),
      })
    )
    .optional(),
  weight: z.number().optional(),
});
export type PriorityType = z.infer<typeof priorityValidate>;

export const ownerRequestsValidate = z
  .object({
    text: z
      .string()
      .min(1, "空のテキストは無効です")
      .max(50, "テキストは50文字以内で入力してください"),
    weight: z
      .number()
      .min(1, "重みは1以上の整数で入力してください")
      .max(5, "重みは1~3の整数で入力してください"),
  })
  .array();
export type OwnerRequestsType = z.infer<typeof ownerRequestsValidate>

//// リクエストボディのバリデーション
export const CreateShiftAiValidate = z.object({
  shiftReqeustId: z.string().uuid(),
  startDate: z.string(),
  endDate: z.string(),
  shiftRequest: ShiftsOfRequestsValidate,
  submittedShifts: z.array(shiftsOfSubmittedWithIdValidate),
  ownerRequests: ownerRequestsValidate,
});
export type CreateShiftValidateType = z.infer<typeof CreateShiftAiValidate>;
