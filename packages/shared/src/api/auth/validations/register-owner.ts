import { z } from "zod";
import { UserRole } from "../../common/types/prisma";

export const userInputValidate = z.object({
	name: z.string().min(1, { message: "name is required" }).max(20),
	pictureUrl: z.string().url().optional(),
	role: z.nativeEnum(UserRole),
});
export type userInputType = z.infer<typeof userInputValidate>;

export const storeNameValidate = z.object({
	name: z.string().min(1, { message: "store name is required" }).max(20),
});
export type StoreNameType = z.infer<typeof storeNameValidate>;
