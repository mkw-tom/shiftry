import type { ShiftRequest, Store, User } from "../../common/types/prisma.js";

export interface AutoLoginServiceResponse {
	user: User | null;
	store: Store | null;
	shiftRequests: ShiftRequest[];
}

export interface AutoLoginResponse {
	ok: true;
	user_token: string;
	store_token: string;
	group_token: string;
	user: User;
	store: Store;
	shiftRequests: ShiftRequest[];
}
