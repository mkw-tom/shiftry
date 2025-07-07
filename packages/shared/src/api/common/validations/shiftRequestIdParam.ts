import { z } from "zod";

export const shiftRequestIdParamValidate = z.object({
	shiftRequestId: z.string().uuid({
		message: "Invalid shiftRequestId format",
	}),
});
export type ShiftRequestIdParamType = z.infer<
	typeof shiftRequestIdParamValidate
>;
