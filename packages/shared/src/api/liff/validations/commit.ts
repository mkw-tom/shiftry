import { z } from "zod";

export const userInputValidate = z.object({
	name: z.string().min(1, { message: "name is required" }).max(20),
	pictureUrl: z.string().url().optional(),
});
export type userInputType = z.infer<typeof userInputValidate>;

export const CommitLiffUserValidate = z.object({
	token: z.string(),
	idToken: z.string().min(10),
	channelType: z.enum(["utou", "group", "room"]),
	channelId: z.string().min(5).nullable().optional(),
	userInput: userInputValidate,
});
export type CommitLiffUserType = z.infer<typeof CommitLiffUserValidate>;
