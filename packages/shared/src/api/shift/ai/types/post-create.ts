import type { ShiftsOfAssignType } from "../../../common/types/json";
import type {
	PriorityType,
	shiftOfSubmittdWithUserId,
} from "../validations/post-create";

export type CreateShiftAiResponse = {
	ok: true;
	assignedShifts: ShiftsOfAssignType[];
	priorities: PriorityType[] | [] | undefined;
	adjustedShifts: ShiftsOfAssignType[];
	unassignedShift: SlotInfo[];
	usersBelowMin: {
		userId: string;
		userName: string;
		assignedCount: number;
		requiredMin: number;
	}[];
};

export type parsePrioritiesFromAiInput = {
	submittedShifts: shiftOfSubmittdWithUserId[];
	ownerRequests?: { text: string; weight: number }[];
};

export type DayOfWeek =
	| "Monday"
	| "Tuesday"
	| "Wednesday"
	| "Thursday"
	| "Friday"
	| "Saturday"
	| "Sunday";

export type SlotInfo = {
	date: string;
	time: string;
	assigned: number;
	required: number;
};

export type DateWeekListResponse = {
	[date: string]: DayOfWeek;
};
