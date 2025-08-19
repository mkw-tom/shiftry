import { StoreLite, UserLite } from "../../common/types/prismaLite.js";
import { ShiftRequest, UserRole } from "../../common/types/prisma.js";

export type AuthMeResponse = {
  ok: true;
  user: UserLite;
  store: StoreLite;
  role: UserRole;
  ActiveShiftRequests: ShiftRequest[];
};
