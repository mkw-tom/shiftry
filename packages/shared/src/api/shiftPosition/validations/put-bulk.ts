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

export const UpsertShiftPositionValidate = z.object({
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
	count: z.number().int().min(1, {
		message: "Count must be a positive integer",
	}),
	weeks: z.array(WeekDays).min(1, {
		message: "At least one week must be selected",
	}),
	absolute: z
		.array(
			z.object({
				id: z.string().min(1, {
					message: "Staff ID must be a non-empty string",
				}),
				name: z.string().min(1, {
					message: "Staff name must be a non-empty string",
				}),
				pictureUrl: z.string().optional(),
			}),
		)
		.min(0),
	priority: z
		.array(
			z.object({
				id: z.string().min(1, {
					message: "Staff ID must be a non-empty string",
				}),
				name: z.string().min(1, {
					message: "Staff name must be a non-empty string",
				}),
				pictureUrl: z.string().optional(),
			}),
		)
		.min(0),
});
export type UpsertShiftPositionType = z.infer<
	typeof UpsertShiftPositionValidate
>;

export const bulkUpsertShiftPositionValidate = z
	.array(UpsertShiftPositionValidate)
	.min(1, {
		message: "At least one shift position must be provided",
	});

export type bulkUpsertShiftPositionType = z.infer<
	typeof bulkUpsertShiftPositionValidate
>;
