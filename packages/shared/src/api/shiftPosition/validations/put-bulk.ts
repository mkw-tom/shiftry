import { count } from "node:console";
import z from "zod";

export const WeekDays = z.enum([
	"monday",
	"tuesday",
	"wednesday",
	"thursday",
	"friday",
	"saturday",
	"sunday",
]);
export type WeekDayType = z.infer<typeof WeekDays>;
export type WeekDayArray = WeekDayType[];

const HHmm = z
	.string()
	.min(1, { message: "入力必須です" }) // 空文字チェック
	.regex(/^\d{2}:\d{2}$/, { message: "時刻は HH:mm 形式で入力してください" });

const timeLt = (a: string, b: string) => a < b; // "09:00" 形式なら文字比較でOK

const ISODateTime = z
	.string()
	.min(1, { message: "入力必須です" })
	.refine((v) => !Number.isNaN(Date.parse(v)), {
		message: "日時は ISO 形式で入力してください",
	});

export const UpsertShiftPositionBase = z.object({
	name: z
		.string()
		.trim()
		.min(1, { message: "ポジション名を入力してください" })
		.max(15, { message: "ポジション名は15文字以内で入力してください" }),
	startTime: ISODateTime,
	endTime: ISODateTime,
	jobRoles: z
		.array(
			z
				.string()
				.trim()
				.min(1, { message: "業務バッジは1文字以上で入力してください" }),
		)
		.transform((arr) => Array.from(new Set(arr.filter(Boolean)))),
	count: z.coerce
		.number()
		.int({ message: "必要人数は整数で入力してください" })
		.min(1, { message: "必要人数は1以上で設定してください" }),
	weeks: z
		.array(WeekDays)
		.min(1, { message: "対象曜日を1つ以上選択してください" }),
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
});
export type UpsertShiftPositionBaseInput = z.input<
	typeof UpsertShiftPositionBase
>;
export type UpsertShiftPositoinBaseOutput = z.output<
	typeof UpsertShiftPositionBase
>;
export type UpsertShiftPositionBaseType = z.infer<
	typeof UpsertShiftPositionBase
>;

export const UpsertShiftPositionValidate = UpsertShiftPositionBase.superRefine(
	(v, ctx) => {
		if (!timeLt(v.startTime, v.endTime)) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ["endTime"],
				message: "開始時刻は終了時刻より前に設定してください",
			});
		}
		if (v.absolute.length > v.count) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ["count"],
				message: "固定スタッフの人数が必要人数を超えています",
			});
		}
		const absIds = new Set(v.absolute.map((u) => u.id));
		const dup = v.priority.find((u) => absIds.has(u.id));
		if (dup) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ["priority"],
				message: "固定スタッフと優先スタッフが重複しています",
			});
		}
		const checkDup = (
			arr: { id: string }[],
			label: "absolute" | "priority",
		) => {
			const seen = new Set<string>();
			for (const u of arr) {
				if (seen.has(u.id)) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						path: [label],
						message: `${
							label === "absolute" ? "固定" : "優先"
						}スタッフに重複があります`,
					});
					break;
				}
				seen.add(u.id);
			}
		};
		checkDup(v.absolute, "absolute");
		checkDup(v.priority, "priority");
	},
);

export type UpsertShiftPositionInput = z.input<
	typeof UpsertShiftPositionValidate
>;
export type UpsertShiftPositionOutput = z.output<
	typeof UpsertShiftPositionValidate
>;
export type UpsertShiftPositionType = z.infer<typeof UpsertShiftPositionBase>;

export const bulkUpsertShiftPositionValidate = z
	.array(UpsertShiftPositionValidate)
	.min(1, {
		message: "At least one shift position must be provided",
	});

export type bulkUpsertShiftPositionInput = z.input<
	typeof bulkUpsertShiftPositionValidate
>;
export type bulkUpsertShiftPositionOutput = z.output<
	typeof bulkUpsertShiftPositionValidate
>;
export type bulkUpsertShiftPositionType = z.input<
	typeof bulkUpsertShiftPositionValidate
>;
