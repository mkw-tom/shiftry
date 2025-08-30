import type { $Enums } from "@prisma/client";
import type { RequestsType } from "./validations/put.js";

export type ShiftRequestDTO = {
	type: $Enums.ShiftType;
	status: $Enums.RequestStatus;
	id: string;
	storeId: string;
	weekStart: Date;
	weekEnd: Date;
	requests: RequestsType;
	deadline: Date | null;
	createdAt: Date;
	updatedAt: Date;
};
