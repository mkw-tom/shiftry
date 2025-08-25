import type { ShiftRequest, UserRole } from "../../common/types/prisma.js";
import type {
	Member,
	StoreLite,
	UserLite,
} from "../../common/types/prismaLite.js";

export type AuthMeResponse = {
	ok: true;
	user: UserLite;
	store: StoreLite;
	role: UserRole;
	members: Member[];
	ActiveShiftRequests: ShiftRequest[];
};
