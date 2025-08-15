export type VerifyLiffUserResponse = {
	ok: boolean;
	token: string;
	flags: {
		existingUser: boolean;
		channelLinked: boolean;
		storeId: string | null;
	};
	next: "LOGIN" | "REGISTER";
};
