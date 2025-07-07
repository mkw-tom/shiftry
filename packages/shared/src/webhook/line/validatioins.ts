import z from "zod";

export const RequestShiftMessageValidate = z.object({
	shiftRequestId: z
		.string()
		.uuid("this id format is invalid")
		.min(1, "Shift request ID is required"),
	startDate: z.string().min(1, "Start date is required"),
	endDate: z.string().min(1, "End date is required"),
	deadline: z.string().min(1, "Deadline is required"),
});
export type RequestShiftMessageType = z.infer<
	typeof RequestShiftMessageValidate
>;

export const ConfirmShiftMessageValidate = z.object({
	shiftRequestId: z
		.string()
		.uuid("this id format is invalid")
		.min(1, "Shift request ID is required"),
	startDate: z.string().min(1, "Start date is required"),
	endDate: z.string().min(1, "End date is required"),
});
export type ConfirmShiftMessageType = z.infer<
	typeof ConfirmShiftMessageValidate
>;
