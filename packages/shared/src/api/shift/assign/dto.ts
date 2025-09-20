import type { $Enums } from "@prisma/client";
import type { ShiftsOfAssignType } from "./validations/put.js";

export type AssignShiftDTO = {
	id: string;
	storeId: string;
	shiftRequestId: string;
	shifts: ShiftsOfAssignType;
	status: $Enums.ShiftStatus;
	updatedAt: Date;
	createdAt: Date;
};
