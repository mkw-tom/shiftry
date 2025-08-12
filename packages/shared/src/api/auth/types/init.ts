import type { ShiftRequest, Store, User } from "../../common/types/prisma.js";

export interface InitServiceResponse {
	user: User;
	store: Store;
	shiftRequests: ShiftRequest[] | [];
}
export interface InitResponse {
	ok: true;
	// user: User;
	store: Store;
	shiftRequests: ShiftRequest[];
	// user_token: string;
	store_token: string;
	group_token: string;
}
