import { availableWeekType } from "@shared/api/common/types/json";
import type { DefaultTimePositionsType } from "@shared/api/common/types/json";
import type { UpsertSubmittedShiftInputType } from "@shared/api/shift/submit/validations/put";
import type React from "react";
import type { Dispatch, SetStateAction } from "react";
import { RiTimeLine } from "react-icons/ri";
import { useBottomDrawer } from "../../../context/useBottomDrawer";
import AddAvailableWeekModal from "./AddAvailableWeekModal";
import type { DayOfWeekType } from "./Submit";

const AvailableWeeksForm = ({
	formData,
	setFormData,
}: {
	formData: UpsertSubmittedShiftInputType;
	setFormData: Dispatch<SetStateAction<UpsertSubmittedShiftInputType>>;
}) => {
	const { currentData } = useBottomDrawer();
	const weekShiftData = currentData?.requests
		.defaultTimePositions as DefaultTimePositionsType;

	function InputAvailableWeek(
		e: React.ChangeEvent<HTMLInputElement>,
		day: DayOfWeekType,
	) {
		const checked = e.target.checked;

		setFormData((prev) => ({
			...prev,
			shifts: {
				...prev.shifts,
				availableWeeks: checked
					? [...prev.shifts.availableWeeks, day]
					: prev.shifts.availableWeeks.filter((d) => !d.startsWith(day)),
			},
		}));
	}

	const dayOfweekArray: DayOfWeekType[] = [
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
		"Sunday",
	];

	const UpdateAvailableWeekTime = (
		day: DayOfWeekType,
		startTime: string,
		endTime: string,
	) => {
		const timeRange = `${startTime}-${endTime}`;
		const newEntry = `${day}&${timeRange}`;

		setFormData((prev) => ({
			...prev,
			shifts: {
				...prev.shifts,
				availableWeeks: [
					...prev.shifts.availableWeeks.filter(
						(d) => d !== day && !d.startsWith(`${day}&`),
					),
					newEntry,
				],
			},
		}));
	};

	const RemoveAvailableWeekTime = (day: DayOfWeekType) => {
		if (!confirm("時間指定を取り消しますか？")) return;
		setFormData((prev) => ({
			...prev,
			shifts: {
				...prev.shifts,
				availableWeeks: prev.shifts.availableWeeks.map((d) =>
					d.startsWith(`${day}&`) ? day : d,
				),
			},
		}));
	};

	const parseTimeRange = (data: string) => {
		const [availableDay, timeRange] = data.split("&");
		if (timeRange === undefined) {
			return { day: availableDay };
		}
		const [start, end] = timeRange.split("-");
		return {
			day: availableDay,
			startTime: start.trim(),
			endTime: end.trim(),
		};
	};

	const getJapaneseDay = (day: DayOfWeekType): string => {
		const dayMap: { [key: string]: string } = {
			Monday: "月曜",
			Tuesday: "火曜",
			Wednesday: "水曜",
			Thursday: "木曜",
			Friday: "金曜",
			Saturday: "土曜",
			Sunday: "日曜",
		};
		return dayMap[day] || day;
	};

	return (
		<div className="  text-black  w-full flex flex-col ">
			<span className="text-md font-thin opacity-70 tabular-nums text-black">
				② 出勤可能な曜日
			</span>

			<ul className="list-no flex flex-col gap-1 w-full pl-2">
				{dayOfweekArray
					.filter((day) => weekShiftData?.[day]?.length > 0)
					.map((day) => (
						<li
							key={day}
							className="border-b-1 border-gray01 pl-2 py-3 flex items-center justify-between "
						>
							<div className="flex gap-2 items-center">
								<input
									type="checkbox"
									className="checkbox checkbox-sm checkbox-success mr-2"
									checked={formData.shifts.availableWeeks.some((d) =>
										d.startsWith(day),
									)}
									onChange={(e) => InputAvailableWeek(e, day)}
								/>
								<h2 className="text-md font-thin opacity-70 tabular-nums text-blac">
									{getJapaneseDay(day)}
								</h2>
							</div>
							<div>
								{formData.shifts.availableWeeks
									.filter((data) => data.startsWith(`${day}&`))
									.map((entry) => {
										const { startTime, endTime } = parseTimeRange(entry);
										return (
											<div key={entry} className="flex items-center gap-1">
												<RiTimeLine className="text-black opacity-70" />
												<span className="text-black opacity-70">
													{startTime} - {endTime}
												</span>
											</div>
										);
									})}
							</div>

							<AddAvailableWeekModal
								day={day}
								formData={formData}
								parseTimeRange={parseTimeRange}
								UpdateAvailableWeekTime={UpdateAvailableWeekTime}
								RemoveAvailableWeekTime={RemoveAvailableWeekTime}
							/>
						</li>
					))}
			</ul>
		</div>
	);
};

export default AvailableWeeksForm;
