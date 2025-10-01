import type { AssignShiftDTO } from "../../assign/dto.js";
import type { ShiftRequestDTO } from "../../request/dto.js";

export type NotificationConfirmShiftResponse = {
	ok: true;
	message: string;
	shiftRequest: ShiftRequestDTO;
	assignShift: AssignShiftDTO;
};
