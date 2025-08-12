import z from "zod";

export const VerifyLiffUserValidate = z.object({
	idToken: z.string(),
	channelType: z.enum(["utou", "group", "room"]),
	channelId: z.string().min(5).nullable().optional(),
});

export type VerifyLiffUserType = z.infer<typeof VerifyLiffUserValidate>;
