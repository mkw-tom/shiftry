import type { SubmittedShift } from "@shared/api/common/types/prisma.js";
import type { SubmittedDataType } from "@shared/api/shift/submit/validations/put.js";

export const toSubmittedShiftDTO = (submittedShift: SubmittedShift) => {
	return {
		...submittedShift,
		shifts: (submittedShift.shifts === null
			? {}
			: submittedShift.shifts) as SubmittedDataType,
		weekMin: submittedShift.weekMin ?? 1,
		weekMax: submittedShift.weekMax ?? 1,
	};
};

export const toSubmittedShiftsDTO = (submittedShifts: SubmittedShift[]) => {
	return submittedShifts.map((submittedShift) => ({
		...submittedShift,
		shifts: (submittedShift.shifts === null
			? {}
			: submittedShift.shifts) as SubmittedDataType,
		weekMin: submittedShift.weekMin ?? 1,
		weekMax: submittedShift.weekMax ?? 1,
	}));
};
