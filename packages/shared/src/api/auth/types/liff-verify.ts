import { UserLite } from "../../common/types/prismaLite.js";

export type VerifyLiffUserResponse = NotExistResponse | ExistingUserResponse;

export type NotExistResponse = {
	ok: true;
	token: null
	next: "REGISTER";
}

export type ExistingUserResponse = {
	ok: true;
	token: string;
	next: "LOGIN";
}