export type VerifyLiffUserResponse =
	| NotExistResponse
	| ExistingUserResponse
	| RedirectingResponse;

export type NotExistResponse = {
	ok: true;
	token: null;
	next: "REGISTER";
};

export type ExistingUserResponse = {
	ok: true;
	token: string;
	next: "LOGIN";
};

export type RedirectingResponse = {
	ok: true;
	next: "REDIRECTING";
};
