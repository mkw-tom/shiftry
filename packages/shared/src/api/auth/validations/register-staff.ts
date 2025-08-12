import { z } from "zod";

export const userInputValidate = z.object({
	name: z.string().min(1, { message: "name is required" }).max(20),
	pictureUrl: z.string().url().optional(),
});
export type userInputType = z.infer<typeof userInputValidate>;

export const storeIdandShfitReruestIdValidate = z.object({
	storeId: z.string({ message: "Invalid storeId format" }).uuid(),
	shiftRequestId: z.string({ message: "Invalid shiftRequestId format" }).uuid(),
});
export type storeIdandShfitReruestIdType = z.infer<
	typeof storeIdandShfitReruestIdValidate
>;
