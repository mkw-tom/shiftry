import { z } from "zod";

export const SHIFT_TYPE = ["MONTHLY", "WEEKLY"] as const;
export const REQUEST_STATUS = [
	"HOLD",
	"REQUEST",
	"ADJUSTMENT",
	"CONFIRMED",
] as const;

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

export const ShiftsOfRequestPositionValidate = z.object({
	defaultTimePositions: DefaultTimePositionsSchema,
	overrideDates: OverrideDatesSchema,
});
export type ShiftsOfRequestsType = z.infer<
	typeof ShiftsOfRequestPositionValidate
>;

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
			message: "優先度は1~3の数字で選択してください",
		})
		.max(3, {
			message: "優先度は1~3の数字で選択してください",
		}),
});
export type PriorityUserType = z.infer<typeof priorityUserSchema>;
export type AbsoluteUserType = z.infer<typeof AbsoluteUserSchema>;

// 時間帯ごとの割り当て情報スキーマ
export const RequestPositionValidate = z.object({
	name: z
		.string()
		.trim()
		.min(1, { message: "ポジション名を入力してください" })
		.max(15, { message: "ポジション名は15文字以内で入力してください" }),
	count: z.coerce
		.number()
		.int({ message: "必要人数は整数で入力してください" })
		.min(1, { message: "必要人数は1以上で設定してください" }),
	absolute: z
		.array(
			z.object({
				id: z.string().min(1, { message: "スタッフIDを入力してください" }),
				name: z.string().min(1, { message: "スタッフ名を入力してください" }),
				pictureUrl: z
					.string()
					.url({ message: "画像URLの形式が正しくありません" })
					.optional(),
			}),
		)
		.default([]),
	priority: z
		.array(
			z.object({
				id: z.string().min(1, { message: "スタッフIDを入力してください" }),
				name: z.string().min(1, { message: "スタッフ名を入力してください" }),
				pictureUrl: z
					.string()
					.url({ message: "画像URLの形式が正しくありません" })
					.optional(),
				level: z.coerce
					.number()
					.int({ message: "優先度は整数で入力してください" })
					.min(1, { message: "優先度は1以上で設定してください" })
					.max(3, { message: "優先度は3以下で設定してください" }),
			}),
		)
		.default([]),
	jobRoles: z.array(
		z
			.string()
			.trim()
			.min(1, { message: "業務バッジは1文字以上で入力してください" }),
	),
});

export type RequestPositionInput = z.input<typeof RequestPositionValidate>;
export type RequestPositionOutput = z.output<typeof RequestPositionValidate>;
export type RequestPositionType = z.infer<typeof RequestPositionValidate>;

// フロントエンド用（時間情報が文字列のまま）
const HHmm = z
	.string()
	.min(1, { message: "入力必須です" }) // 空文字チェック
	.regex(/^\d{2}:\d{2}$/, { message: "時刻は HH:mm 形式で入力してください" });

export const RequestPositionWithDateValidate = RequestPositionValidate.extend({
	startTime: HHmm,
	endTime: HHmm,
});

export type RequestPositionWithDateInput = z.input<
	typeof RequestPositionWithDateValidate
>;
export type RequestPositionWithDateOutput = z.output<
	typeof RequestPositionWithDateValidate
>;
export type RequestPositionWithDateType = z.infer<
	typeof RequestPositionWithDateValidate
>;

// 日付ごとのスキーマ（null も許容）
export const DateSchema = z.record(
	z.string(), // 例: "10:00-14:00"
	RequestPositionValidate,
);
export type DateType = z.infer<typeof DateSchema>;

// 全体のスケジュールスキーマ
export const RequestsValidate = z.record(
	z.string(), // 例: "2025-08-01"
	z.union([DateSchema, z.null()]),
);

export type RequestsType = z.infer<typeof RequestsValidate>;
export type RequestsTypeInput = z.input<typeof RequestsValidate>;
export type RequestsTypeOutput = z.output<typeof RequestsValidate>;

const dateValidate = z
	.string()
	.min(1, { message: "カレンダーを選択してください" })
	.refine((v) => !Number.isNaN(Date.parse(v)), {
		message: "日付の形式が正しくありません（YYYY-MM-DD または ISO 形式）",
	});

const deadlineValidate = z
	.string()
	.min(1, { message: "提出期限は必須入力です" })
	.refine((v) => !Number.isNaN(Date.parse(v)), {
		message: "日付の形式が正しくありません（YYYY-MM-DD または ISO 形式）",
	});

/** 依頼の作成/更新（クライアント用：すべて string のまま） */
export const UpsertShiftRequestBase = z.object({
	weekStart: dateValidate,
	weekEnd: dateValidate,
	type: z.enum(SHIFT_TYPE, {
		errorMap: () => ({ message: "シフト種別が不正です" }),
	}),
	requests: RequestsValidate,
	status: z.enum(REQUEST_STATUS, {
		errorMap: () => ({ message: "依頼ステータスが不正です" }),
	}),
	deadline: deadlineValidate,
});

export const upsertShiftRequestValidate = UpsertShiftRequestBase.superRefine(
	(v, ctx) => {
		const ws = Date.parse(v.weekStart);
		const we = Date.parse(v.weekEnd);
		const dl = Date.parse(v.deadline);
		if (!(ws < we))
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ["weekEnd"],
				message: "週の開始日は終了日より前に設定してください",
			});
		if (!(dl > Date.now()))
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ["deadline"],
				message: "提出期限は現在時刻より後に設定してください",
			});
		if (!(dl <= ws))
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ["deadline"],
				message: "提出期限は週の開始日より前に設定してください",
			});
	},
);

export type UpsertShiftRequetType = z.infer<typeof upsertShiftRequestValidate>;
export type UpsertShiftRequetInput = z.input<typeof upsertShiftRequestValidate>;
export type UpsertShiftRequetOutput = z.output<
	typeof upsertShiftRequestValidate
>;

export const SelectDateOfRequestPositionValidate = UpsertShiftRequestBase.pick({
	weekStart: true,
	weekEnd: true,
	deadline: true,
});
export type SelectDateOfRequestPositionInput = z.infer<
	typeof SelectDateOfRequestPositionValidate
>;
