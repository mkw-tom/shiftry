import z from "zod";

const days = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;

export const WeeklyAvailabilityValidate = z.object(
	Object.fromEntries(days.map((day) => [day, z.string()])),
);
export type WeeklyAvailabilityType = z.infer<typeof WeeklyAvailabilityValidate>;

export const StaffPreferenceDTOValidate = z.object({
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
	userId: z.string(),
	storeId: z.string(),
	weeklyAvailability: WeeklyAvailabilityValidate,
	weekMin: z.number().int().min(0).max(7),
	weekMax: z.number().int().min(0).max(7),
	note: z.string().nullable(),
});

export type StaffPreferenceDTO = z.infer<typeof StaffPreferenceDTOValidate>;
