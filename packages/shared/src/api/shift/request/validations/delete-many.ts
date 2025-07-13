import z from "zod";

export const deleteManyShiftRequestValidate = z.object({
	ids: z.array(z.string().uuid(), {
		errorMap: () => ({ message: "Invalid UUID format for IDs" }),
	}),
});
export type DeleteManyShiftRequestType = z.infer<
	typeof deleteManyShiftRequestValidate
>;
