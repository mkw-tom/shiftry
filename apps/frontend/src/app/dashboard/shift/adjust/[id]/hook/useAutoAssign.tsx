import type { AssignShiftDTO } from "@shared/api/shift/assign/dto";
import type { ShiftRequestDTO } from "@shared/api/shift/request/dto";
import { type AutoAssignPeriod, autoAssign } from "@shared/utils/AutoAssign";
import type React from "react";
import { useState } from "react";

export const useAutoAssign = ({
	assignShiftData,
	shiftRequestData,
	setAssignShiftData,
}: {
	assignShiftData: AssignShiftDTO;
	shiftRequestData: ShiftRequestDTO;
	setAssignShiftData: React.Dispatch<React.SetStateAction<AssignShiftDTO>>;
}) => {
	const [isLoading, setIsLoading] = useState(false);

	const autoAssignFunc = (
		checkedFields: string[],
		period?: AutoAssignPeriod,
	) => {
		setIsLoading(true);
		setTimeout(() => {
			const newAssignShiftData = autoAssign(
				assignShiftData,
				shiftRequestData,
				checkedFields,
				period,
			);
			setAssignShiftData(newAssignShiftData);
			setIsLoading(false);
		}, 1000);
	};

	return { autoAssignFunc, isLoading };
};
