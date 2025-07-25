import { z } from "zod";
import { ShiftStatus } from "../../../common/types/prisma";

// ✅ 曜日 + optional 時間帯の形式（例: "Monday&11:00-17:00"）
export const availableWeekValidate = z.string().refine(
	(val) => {
		const [day, time] = val.split("&");
		const validDays = [
			"Monday",
			"Tuesday",
			"Wednesday",
			"Thursday",
			"Friday",
			"Saturday",
			"Sunday",
		];
		if (!validDays.includes(day)) return false;
		if (!time) return true; // 時間指定なしでもOK（終日出勤可）

		return /^([01]\d|2[0-3]):[0-5]\d(-([01]\d|2[0-3]):[0-5]\d)?$/.test(time); // HH:mm-HH:mm または HH:mm-
	},
	{
		message: "形式は '曜日' または '曜日&HH:mm-HH:mm' で入力してください",
	},
);
export type availableWeekType = z.infer<typeof availableWeekValidate>;

// ✅ 日付 + optional 時間帯の形式（例: "2025-11-12&08:00-15:00"）
export const specificDatesValidate = z.string().refine(
	(val) => {
		const [date, time] = val.split("&");
		const isDateValid = /^\d{4}-\d{2}-\d{2}$/.test(date);
		if (!isDateValid) return false;

		if (!time) return true;
		return /^([01]\d|2[0-3]):[0-5]\d(-([01]\d|2[0-3]):[0-5]\d)?$/.test(time);
	},
	{
		message:
			"形式は 'YYYY-MM-DD' または 'YYYY-MM-DD&HH:mm-HH:mm' で入力してください",
	},
);
export type specificDatesType = z.infer<typeof specificDatesValidate>;

export const shiftsOfSubmittedValidate = z.object({
	// name: z
	//   .string()
	//   .min(1, "ニックネームは必須です")
	//   .max(20, "20文字以内で入力してください"),
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

export type shiftsOfSubmittedType = z.infer<typeof shiftsOfSubmittedValidate>;

// 時間指定の形式（"HH:MM-HH:MM"）
export const timeRangeSchema = z.string().regex(/^\d{2}:\d{2}-\d{2}:\d{2}$/, {
	message: "Time must be in format HH:MM-HH:MM",
});

// 各日付の値："anytime" or "HH:MM-HH:MM" or null
export const dateValueSchema = z.union([
	z.literal("anytime"),
	timeRangeSchema,
	z.null(),
]);

// 全体のカレンダースキーマ（"2025-08-01": 値）
export const SubmittedCalenderValidate = z.record(
	z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
		message: "Date must be in format YYYY-MM-DD",
	}),
	dateValueSchema,
);

// 型定義
export type SubmittedCalendarType = z.infer<typeof SubmittedCalenderValidate>;

export const upsertSubmittedShiftValidate = z.object({
	shiftRequestId: z.string(),
	startDate: z.string().refine((val) => !Number.isNaN(Date.parse(val)), {
		message: "Invalid date format",
	}),
	endDate: z.string().refine((val) => !Number.isNaN(Date.parse(val)), {
		message: "Invalid date format",
	}),
	name: z
		.string()
		.min(1, "ニックネームは必須です")
		.max(20, "20文字以内で入力してください"),
	shifts: shiftsOfSubmittedValidate,
	status: z.nativeEnum(ShiftStatus, {
		errorMap: () => ({ message: "Invalid status" }),
	}),
});

export type UpsertSubmittedShiftInputType = z.infer<
	typeof upsertSubmittedShiftValidate
>;

export type UpsertSubmittedShiftWithCalendar = Omit<
	UpsertSubmittedShiftInputType,
	"shifts"
> & {
	shifts: SubmittedCalendarType;
};
