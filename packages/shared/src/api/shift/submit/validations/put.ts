import { z } from "zod";
import { SHIFT_STSTUS } from "../../../common/types/prisma.js";

// 時間指定の形式（"HH:MM-HH:MM"）
export const timeRangeSchema = z.string().regex(/^\d{2}:\d{2}-\d{2}:\d{2}$/, {
	message: "Time must be in format HH:MM-HH:MM",
});

// 各日付の値："anytime" or "HH:MM-HH:MM" or null
export const submitValueSchema = z.union([
	z.literal("anytime"),
	timeRangeSchema,
	z.null(),
]);
export type submitValueType = z.infer<typeof submitValueSchema>;
// 全体のカレンダースキーマ（"2025-08-01": 値）
export const SubmittedDataValidate = z.record(
	z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
		message: "Date must be in format YYYY-MM-DD",
	}),
	submitValueSchema,
);

// 型定義
export type SubmittedDataType = z.infer<typeof SubmittedDataValidate>;
export type SubmittedDataInput = z.input<typeof SubmittedDataValidate>;

export const upsertSubmittedShiftValidate = z.object({
	shiftRequestId: z.string(),
	shifts: SubmittedDataValidate,
	weekMin: z.number().int().min(1).max(7),
	weekMax: z.number().int().min(1).max(7),
	memo: z.string().max(50, "50文字以内で入力してください").optional(),
	status: z.enum(SHIFT_STSTUS, {
		errorMap: () => ({ message: "Invalid status" }),
	}),
});
export type UpsertSubmittedShiftInput = z.input<
	typeof upsertSubmittedShiftValidate
>;
export type upsertSubmittedShiftOutput = z.output<
	typeof upsertSubmittedShiftValidate
>;
export type UpsertSubmittedShiftInputType = z.infer<
	typeof upsertSubmittedShiftValidate
>;
