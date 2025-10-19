import { z } from "zod";
import { ShiftOfAssignValidate } from "../../../../api/shift/assign/validations/put.js";
import { ShiftRequestDTOValidate } from "../../../../api/shift/request/dto.js";
import { SubmittedShiftDTOValidate } from "../../../../api/shift/submit/dto.js";

const TemplateShiftValidate = ShiftRequestDTOValidate;
export type TemplateShiftType = z.infer<typeof TemplateShiftValidate>;
export type TemplateShiftInput = z.input<typeof TemplateShiftValidate>;

export const sourceEnum = z.enum(["absolute", "priority", "auto", "manual"]);
export type SourceType = z.infer<typeof sourceEnum>;

const AiAssignedUserValidate = z.object({
	uid: z.string(),
	displayName: z.string(),
	pictureUrl: z.string().nullable().optional(),
	confirmed: z.boolean().optional(),
	source: sourceEnum,
});
export type AIAssignedUserType = z.infer<typeof AiAssignedUserValidate>;

export const CurrentAssignmentsValidate = ShiftOfAssignValidate;
export type CurrentAssignmentsType = z.infer<typeof CurrentAssignmentsValidate>;
export type CurrentAssignmentsInput = z.input<
	typeof CurrentAssignmentsValidate
>;

export const SubmissionsValidate = SubmittedShiftDTOValidate;
export type SubmissionsType = z.infer<typeof SubmissionsValidate>;
export type SubmissionsInput = z.input<typeof SubmissionsValidate>;

export const memberProfileValidate = z.object({
	uid: z.string().min(1, "uid is required"),
	displayName: z
		.string()
		.trim()
		.min(1, "displayName must not be empty")
		.optional(),
	pictureUrl: z
		.string()
		.url("Invalid URL format")
		.refine(
			(val) => val.startsWith("http://") || val.startsWith("https://"),
			"URL must start with http:// or https://",
		)
		.optional(),
	jobRoles: z.array(z.string().min(1)).optional(),
});
export type MemberProfileType = z.infer<typeof memberProfileValidate>;
export type MemberProfileInput = z.input<typeof memberProfileValidate>;

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
	currentAssignments: CurrentAssignmentsValidate,
	submissions: z.array(SubmittedShiftDTOValidate),
	memberProfiles: z.array(memberProfileValidate),
	constraints: ConstraintsValidate.optional(),
});

/**
 * ---- 型補完 ----
 */
export type AIShiftAdjustRequest = z.infer<typeof AiShiftAdjustValidate>;
export type AIShiftAdjustRequestInput = z.input<typeof AiShiftAdjustValidate>;
