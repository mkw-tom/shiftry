import { z } from "zod";

export const WeekStartParamValidate = z.object({
	weekStart: z.string().refine((val) => !Number.isNaN(Date.parse(val)), {
		message: "Invalid date format",
	}),
});
export type WeekStartParamType = z.infer<typeof WeekStartParamValidate>;
