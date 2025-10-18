import { z } from "zod";

/**
 * ---- 各要素の共通スキーマ ----
 */

// Priority（優先度）
const PriorityValidate = z.object({
	id: z.string(),
	name: z.string(),
	level: z.number().int().min(1),
});

// Absolute（固定メンバー）
const AbsoluteValidate = z.object({
	id: z.string(),
	name: z.string(),
});

// シフト枠（1日あたりの1スロット）
const ShiftSlotValidate = z.object({
	name: z.string(),
	count: z.number().int().min(1),
	jobRoles: z.array(z.string()).default([]),
	absolute: z.array(AbsoluteValidate).default([]),
	priority: z.array(PriorityValidate).default([]),
});

// シフトリクエスト（雛形）
const TemplateShiftValidate = z.object({
	id: z.string(),
	storeId: z.string(),
	weekStart: z.string().datetime(),
	weekEnd: z.string().datetime(),
	type: z.enum(["WEEKLY", "DAILY"]).default("WEEKLY"),
	status: z.enum(["ADJUSTMENT", "CONFIRMED", "DRAFT"]).default("ADJUSTMENT"),
	requests: z.record(
		// 日付キー
		z
			.string()
			.regex(/^\d{4}-\d{2}-\d{2}$/),
		// 時間スロット群
		z.record(z.string().regex(/^\d{2}:\d{2}-\d{2}:\d{2}$/), ShiftSlotValidate),
	),
});
export type TemplateShiftType = z.infer<typeof TemplateShiftValidate>;
export type TemplateShiftInput = z.input<typeof TemplateShiftValidate>;

// 提出データ（スタッフの可用時間）
const SubmissionValidate = z.object({
	userId: z.string(),
	status: z.enum(["ADJUSTMENT", "CONFIRMED", "DRAFT"]).default("ADJUSTMENT"),
	memo: z.string().nullable().optional(),
	shifts: z.record(
		z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
		z.union([
			z.literal("anytime"),
			z.string().regex(/^\d{2}:\d{2}-\d{2}:\d{2}$/),
			z.null(),
		]),
	),
});
export type SubmissionType = z.infer<typeof SubmissionValidate>;
export type submissionsInput = z.input<typeof SubmissionValidate>;

// 現在のアサイン状態
const AssignedUserValidate = z.object({
	uid: z.string(),
	displayName: z.string(),
	pictureUrl: z.string().nullable().optional(),
	confirmed: z.boolean().optional(),
});
export type AssignedUserType = z.infer<typeof AssignedUserValidate>;

const CurrentAssignmentSlotValidate = z.object({
	name: z.string(),
	count: z.number().int().min(1),
	jobRoles: z.array(z.string()).default([]),
	assigned: z.array(AssignedUserValidate).default([]),
	assignedCount: z.number().int().min(0).default(0),
	vacancies: z.number().int().min(0).default(0),
	status: z.enum(["draft", "proposed", "confirmed"]).default("draft"),
	updatedAt: z.string().datetime(),
	updatedBy: z.string(),
});
export type CurrentAssignmentSlotType = z.infer<
	typeof CurrentAssignmentSlotValidate
>;

const CurrentAssignmentsValidate = z.record(
	z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
	z.record(
		z.string().regex(/^\d{2}:\d{2}-\d{2}:\d{2}$/),
		CurrentAssignmentSlotValidate,
	),
);
export type CurrentAssignmentsType = z.infer<typeof CurrentAssignmentsValidate>;
export type CurrentAssignmentsInput = z.input<
	typeof CurrentAssignmentsValidate
>;

export const ConstraintsValidate = z.object({
	maxShiftsPerUserPerWeek: z.number().int().min(1).optional(),
	minShiftsPerUserPerWeek: z.number().int().min(0).optional(),
	restrictConsecutiveWorkingDays: z.number().int().min(1).optional(),
});
export type ConstraintsType = z.infer<typeof ConstraintsValidate>;
export type ConstraintsInput = z.input<typeof ConstraintsValidate>;
/**
 * ---- 最上位スキーマ ----
 */
export const AiShiftAdjustValidate = z.object({
	templateShift: TemplateShiftValidate,
	submissions: z.array(SubmissionValidate),
	currentAssignments: CurrentAssignmentsValidate,
	constraints: ConstraintsValidate.optional(),
});

/**
 * ---- 型補完 ----
 */
export type AIShiftAdjustRequest = z.infer<typeof AiShiftAdjustValidate>;
