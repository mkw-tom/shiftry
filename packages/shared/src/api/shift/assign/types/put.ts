import type { AssignShift } from "../../../common/types/prisma.js";
import type { AssignShiftDTO } from "../dto.js";

export interface UpsertAssigShiftResponse {
	ok: true;
	assignShift: AssignShiftDTO;
}
