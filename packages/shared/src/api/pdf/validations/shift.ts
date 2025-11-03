import { z } from "zod";

const Assigned = z.object({
	uid: z.string(),
	source: z.string(),
	confirmed: z.boolean().optional(),
	pictureUrl: z.string().url().optional(),
	displayName: z.string(),
});

const Slot = z.object({
	name: z.string(),
	count: z.number(),
	status: z.string(),
	assigned: z.array(Assigned),
	jobRoles: z.array(z.string()).optional(),
	vacancies: z.number(),
	assignedCount: z.number(),
});

export const RawShiftJsonValidate = z.record(
	z.string(), // "2025-11-10"
	z.record(z.string(), Slot), // "06:30-08:30": Slot
);

export type RawShiftJsonType = z.infer<typeof RawShiftJsonValidate>;
export type RawShiftJsonInput = z.input<typeof RawShiftJsonValidate>;
