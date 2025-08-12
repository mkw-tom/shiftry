export type VerifyLiffUserResponse = {
	token: string;
	user: { id: string } | null;
	flags: {
		existingUser: boolean;
		channelLinked: boolean;
		storeId: string | undefined;
	};
};
