import z from "zod";
const days = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;

export const timeRangeSchema = z.string().regex(/^\d{2}:\d{2}-\d{2}:\d{2}$/, {
	message: "Time must be in format HH:MM-HH:MM",
});

export const weeklyAvailableSchema = z.union([
	z.literal("anytime"),
	timeRangeSchema,
	z.literal("null"),
]);

export type submitValueType = z.infer<typeof weeklyAvailableSchema>;

export const WeeklyAvailabilityValidate = z.object(
	Object.fromEntries(days.map((day) => [day, weeklyAvailableSchema])),
);

export const createStaffPreferenceValidation = z.object({
	userId: z.string(),
	storeId: z.string(),
	weeklyAvailability: WeeklyAvailabilityValidate,
	weekMin: z.number().int().min(0).max(7),
	weekMax: z.number().int().min(0).max(7),
	note: z.string().nullable().optional(),
});

export type CreateStaffPreferenceInput = z.input<
	typeof createStaffPreferenceValidation
>;
export type CreateStaffPreference = z.infer<
	typeof createStaffPreferenceValidation
>;

export const createEditStaffPreferenceFormValidaton =
	createStaffPreferenceValidation
		.omit({
			storeId: true,
		})
		.extend({
			userName: z
				.string()
				.min(1, "ユーザー名は必須です")
				.max(10, "ユーザー名は10文字以内で入力してください")
				.optional(),
		})
		.refine((data) => data.weekMin <= data.weekMax, {
			message: "weekMinはweekMaxを超えてはいけません",
		});

export type CreateEditStaffPreferenceFormInput = z.input<
	typeof createEditStaffPreferenceFormValidaton
>;
