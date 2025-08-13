export type VerifyLiffUserResponse = {
	ok: boolean;
	token: string;
	user: { id: string } | null;
	flags: {
		existingUser: boolean;
		channelLinked: boolean;
		storeId: string | null;
	};
};
