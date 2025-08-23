import type {
	ShiftsOfAssignType,
	ShiftsOfRequestsType,
	shiftsOfSubmittedType,
} from "./json.js";
import type { AssignShift, ShiftRequest, SubmittedShift } from "./prisma.js";

export type ShiftRequestWithJson = Omit<ShiftRequest, "requests"> & {
	requests: ShiftsOfRequestsType;
};

export type SubmittedShiftWithJson = Omit<SubmittedShift, "shifts"> & {
	shifts: shiftsOfSubmittedType;
};
export type AssignShiftWithJson = AssignShift & {
	shifts: ShiftsOfAssignType[];
};
