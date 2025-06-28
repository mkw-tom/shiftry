import type {
	ShiftsOfAssignType,
	ShiftsOfRequestsType,
	shiftsOfSubmittedType,
} from "./json";
import type { AssignShift, ShiftRequest, SubmittedShift } from "./prisma";

export type ShiftRequestWithJson = ShiftRequest & {
	requests: ShiftsOfRequestsType;
};
export type SubmittedShiftWithJson = SubmittedShift & {
	shifts: shiftsOfSubmittedType[];
};
export type AssignShiftWithJson = AssignShift & {
	shifts: ShiftsOfAssignType[];
};
