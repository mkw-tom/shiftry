import z from "zod";

export const ShiftPositionValidate = z.object({
	name: z
		.string()
		.min(1, {
			message: "Name must be a non-empty string",
		})
		.max(9, {
			message: "Name must be at most 9 characters long",
		}),
	startTime: z.string().refine((val) => !Number.isNaN(Date.parse(val)), {
		message: "Invalid date format",
	}),
	endTime: z.string().refine((val) => !Number.isNaN(Date.parse(val)), {
		message: "Invalid date format",
	}),
	jobRoles: z.array(
		z.string().min(1, {
			message: "Job role must be a non-empty string",
		}),
	),
});
export const bulkUpsertShiftPositionValidate = z.object({
	datas: z.array(ShiftPositionValidate).min(1, {
		message: "At least one shift position must be provided",
	}),
});

export type bulkUpsertShiftPositionValidate = z.infer<
	typeof bulkUpsertShiftPositionValidate
>;
