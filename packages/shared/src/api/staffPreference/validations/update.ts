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

export const updateStaffPreferenceValidation = z.object({
	userId: z.string(),
	weeklyAvailability: WeeklyAvailabilityValidate,
	weekMin: z.number().int().min(0).max(7),
	weekMax: z.number().int().min(0).max(7),
	note: z.string().nullable().optional(),
});

export type UpdateStaffPreferenceInput = z.input<
	typeof updateStaffPreferenceValidation
>;
export type UpdateStaffPreference = z.infer<
	typeof updateStaffPreferenceValidation
>;
