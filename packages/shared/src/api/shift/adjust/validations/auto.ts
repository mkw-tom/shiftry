import { z } from "zod";
import { ShiftOfAssignValidate } from "../../assign/validations/put.js";
import { ShiftRequestDTOValidate } from "../../request/dto.js";
import { SubmittedShiftDTOValidate } from "../../submit/dto.js";

const TemplateShiftValidate = ShiftRequestDTOValidate;
export type TemplateShiftType = z.infer<typeof TemplateShiftValidate>;
export type TemplateShiftInput = z.input<typeof TemplateShiftValidate>;

export const sourceEnum = z.enum(["absolute", "priority", "auto", "manual"]);
export type SourceType = z.infer<typeof sourceEnum>;

const AutoAssignedUserValidate = z.object({
	uid: z.string(),
	displayName: z.string(),
	pictureUrl: z.string().nullable().optional(),
	confirmed: z.boolean().optional(),
	source: sourceEnum,
});
export type AutoAssignedUserType = z.infer<typeof AutoAssignedUserValidate>;

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

const DateYMD = z.string().regex(/^\d{4}-\d{2}-\d{2}$/); // "2025-11-24"
const DateTimeRFC3339 = z.string().datetime(); // "2025-11-24T00:00:00+09:00" など

export const ConstraintsValidate = z
	.object({
		dailyMaxPerUser: z.number().int().min(1).default(1),
		allowPartialOverlap: z.boolean().default(false),
		maximizeDistinctAssignments: z.boolean().default(true),
		countScope: z.enum(["WEEK", "FILTER", "DAY"]).default("WEEK"),

		dateFilter: z
			.discriminatedUnion("mode", [
				z.object({ mode: z.literal("ALL") }),

				z.object({
					mode: z.literal("RANGE"),
					from: DateYMD.or(DateTimeRFC3339),
					to: DateYMD.or(DateTimeRFC3339),
				}),

				z.object({
					mode: z.literal("SINGLE"),
					date: DateYMD.or(DateTimeRFC3339),
				}),
			])
			.default({ mode: "ALL" }),
	})
	.superRefine((val, ctx) => {
		const df = val.dateFilter;
		if (df.mode === "RANGE") {
			if (!df.from || !df.to) {
				ctx.addIssue({
					code: "custom",
					path: ["dateFilter"],
					message: "RANGE は from/to 必須です。",
				});
				return;
			}
			const toJsDate = (s: string) =>
				s.length === 10 ? new Date(`${s}T00:00:00.000+00:00`) : new Date(s);
			if (toJsDate(df.from) > toJsDate(df.to)) {
				ctx.addIssue({
					code: "custom",
					path: ["dateFilter"],
					message: "from は to 以前である必要があります。",
				});
			}
		}
		if (df.mode === "SINGLE" && !df.date) {
			ctx.addIssue({
				code: "custom",
				path: ["dateFilter"],
				message: "SINGLE は date 必須です。",
			});
		}
	});

export type ConstraintsType = z.infer<typeof ConstraintsValidate>;
export type ConstraintsInput = z.input<typeof ConstraintsValidate>;
/**
 * ---- 最上位スキーマ ----
 */
export const AutoShiftAdjustValidate = z.object({
	templateShift: TemplateShiftValidate,
	currentAssignments: CurrentAssignmentsValidate,
	submissions: z.array(SubmittedShiftDTOValidate),
	memberProfiles: z.array(memberProfileValidate),
	constraints: ConstraintsValidate.optional(),
});

/**
 * ---- 型補完 ----
 */
export type AutoShiftAdjustRequest = z.infer<typeof AutoShiftAdjustValidate>;
export type AutoShiftAdjustRequestInput = z.input<
	typeof AutoShiftAdjustValidate
>;
