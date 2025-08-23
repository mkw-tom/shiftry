import type {
	UpsertShiftPositionType,
	WeekDayType,
} from "@shared/api/shiftPosition/validations/put-bulk";
import type React from "react";

const useUpsertPosition = ({
	position,
	setPosition,
}: {
	position: UpsertShiftPositionType;
	setPosition: React.Dispatch<React.SetStateAction<UpsertShiftPositionType>>;
}) => {
	const selectDate = (date: Date | null, target: "startTime" | "endTime") => {
		if (target === "startTime") {
			setPosition((prev) => ({
				...prev,
				startTime: date ? date.toISOString() : "",
			}));
		}

		if (target === "endTime") {
			setPosition((prev) => ({
				...prev,
				endTime: date ? date.toISOString() : "",
			}));
		}
	};

	const adjustStaffCount = (mode: "plus" | "minus") => {
		if (mode === "plus") {
			setPosition((prev) => ({
				...prev,
				count: prev.count + 1,
			}));
		} else if (mode === "minus" && position.count > 1) {
			setPosition((prev) => ({
				...prev,
				count: Math.max(1, prev.count - 1),
			}));
		}
	};

	const checkWeeks = (
		day: {
			label: string;
			value: WeekDayType;
		},
		e: React.ChangeEvent<HTMLInputElement>,
	) => {
		if (e.target.checked) {
			setPosition((prev) => ({
				...prev,
				weeks: [...prev.weeks, day.value],
			}));
		} else {
			setPosition((prev) => ({
				...prev,
				weeks: prev.weeks.filter((w) => w !== day.value),
			}));
		}
	};

	return {
		selectDate,
		adjustStaffCount,
		checkWeeks,
	};
};

export default useUpsertPosition;
