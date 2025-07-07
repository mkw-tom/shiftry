import { z } from "zod";

export const storeIdValidate = z.object({
	storeId: z.string({ message: "Invalid storeId format" }).uuid(),
});
