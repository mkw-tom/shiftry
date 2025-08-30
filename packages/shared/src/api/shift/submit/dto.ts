import type { $Enums } from "@prisma/client";
import type { SubmittedDataType } from "./validations/put.js";

export type SubmittedShiftDTO = {
	status: $Enums.ShiftStatus;
	id: string;
	memo: string | null;
	shiftRequestId: string;
	shifts: SubmittedDataType;
	userId: string;
	storeId: string;
	createdAt: Date;
	updatedAt: Date;
};
