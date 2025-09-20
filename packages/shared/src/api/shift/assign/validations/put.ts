import { z } from "zod";

export const SHIFT_STSTUS = ["ADJUSTMENT", "CONFIRMED"] as const;

export const SourceEnum = z.enum(["absolute", "priority", "auto", "manual"]);
export type SourceType = z.infer<typeof SourceEnum>;

export const ISODate = z
	.string()
	.regex(/^\d{4}-\d{2}-\d{2}$/, "YYYY-MM-DD 形式で入力してください");

export const TimeRange = z
	.string()
	.regex(
		/^([01]\d|2[0-3]):[0-5]\d-([01]\d|2[0-3]):[0-5]\d$/,
		"HH:mm-HH:mm 形式で入力してください",
	)
	.superRefine((val, ctx) => {
		const [s, e] = val.split("-");
		const toMin = (t: string) => {
			const [hh, mm] = t.split(":").map(Number);
			return hh * 60 + mm;
		};
		if (toMin(s) >= toMin(e)) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "終了時刻は開始時刻より後である必要があります",
			});
		}
	});

/** ユーザー割当（1名分） */
export const AssignUserSchema = z.object({
	uid: z.string().min(1),
	displayName: z.string().min(1),
	pictureUrl: z.string().url().optional(),
	source: SourceEnum,
	confirmed: z.boolean().optional().default(false),
});
export type AssignUserType = z.infer<typeof AssignUserSchema>;

export const AssignPositionValidateBase = z.object({
	name: z
		.string()
		.trim()
		.min(1, { message: "ポジション名を入力してください" })
		.max(15, { message: "ポジション名は15文字以内で入力してください" }),
	count: z.coerce
		.number()
		.int({ message: "必要人数は整数で入力してください" })
		.min(1, { message: "必要人数は1以上で設定してください" }),
	jobRoles: z.array(
		z
			.string()
			.trim()
			.min(1, { message: "業務バッジは1文字以上で入力してください" }),
	),
	assigned: z.array(AssignUserSchema).default([]),
	assignedCount: z.number().int().optional(),
	vacancies: z.number().int().optional(),
	status: z.enum(["draft", "proposed", "confirmed", "published"]).optional(),
	updatedAt: z.string().datetime().optional(),
	updatedBy: z.string().optional(),
});
export const AssignPositionValidate = AssignPositionValidateBase.superRefine(
	(slot, ctx) => {
		// UID の重複チェック
		const uids = slot.assigned.map((a) => a.uid);
		const dup = uids.find((u, i) => uids.indexOf(u) !== i);
		if (dup) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ["assigned"],
				message: `同じ uid が重複しています: ${dup}`,
			});
		}
		if (typeof slot.vacancies === "number") {
			const expected = slot.count - slot.assigned.length;
			if (slot.vacancies !== expected) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					path: ["vacancies"],
					message: `vacancies は count - assigned.length と一致する必要があります（期待値: ${expected}）`,
				});
			}
		}
	},
);
export type AssignPositionType = z.infer<typeof AssignPositionValidate>;

const HHmm = z
	.string()
	.min(1, { message: "入力必須です" }) // 空文字チェック
	.regex(/^\d{2}:\d{2}$/, { message: "時刻は HH:mm 形式で入力してください" });

export const AssignPositionBaseWithDateValidate =
	AssignPositionValidateBase.extend({
		startTime: HHmm,
		endTime: HHmm,
	});
export type AssignPositionWithDateInput = z.input<
	typeof AssignPositionBaseWithDateValidate
>;
export type AssignPositionWithDate = z.infer<
	typeof AssignPositionBaseWithDateValidate
>;

export const AssignDaySchema = z.record(TimeRange, AssignPositionValidate);
export type AssignDay = z.infer<typeof AssignDaySchema>;

/** 期間全体: "YYYY-MM-DD" -> AssignDay */
export const ShiftOfAssignValidate = z.record(ISODate, AssignDaySchema);
export type ShiftsOfAssignType = z.infer<typeof ShiftOfAssignValidate>;

export const upsertAssignShfitValidate = z.object({
	shiftRequestId: z.string().uuid(),
	shifts: ShiftOfAssignValidate,
	status: z.enum(SHIFT_STSTUS, {
		errorMap: () => ({ message: "Invalid status" }),
	}),
});

export type UpsertAssignShfitInputType = z.infer<
	typeof upsertAssignShfitValidate
>;
export type UpsertAssignShfitInput = z.input<typeof upsertAssignShfitValidate>;
export type UpsertAssignShfitOutput = z.output<
	typeof upsertAssignShfitValidate
>;
