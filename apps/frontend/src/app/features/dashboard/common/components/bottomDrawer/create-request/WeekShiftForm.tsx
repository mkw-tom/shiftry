import { PiUser } from "react-icons/pi";
import { useCreateRequest } from "../../../context/useCreateRequest";
import AddWeekShiftModal from "./AddWeekShiftModal";

const WeekShiftForm = () => {
	type DayOfWeekType =
		| "Monday"
		| "Tuesday"
		| "Wednesday"
		| "Thursday"
		| "Friday"
		| "Saturday"
		| "Sunday";

	const { formData, setFormData } = useCreateRequest();
	const weekShiftData = formData.requests.defaultTimePositions;

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

	function parsePositon(position: string) {
		const [timeRange, people] = position.split("*");
		const [start, end] = timeRange.split("-");
		return {
			startTime: start.trim(),
			endTime: end.trim(),
			amount: people.trim(),
		};
	}

	return (
		<div className="h-[400px] pb-56 overflow-y-auto">
			<ul className="list  rounded-box">
				{Object.entries(weekShiftData).map(([day, shifts]) => (
					<li key={day} className="list-row  border-b-1 border-gray01">
						<div className="text-xl font-thin opacity-50 tabular-nums text-black ">
							{getJapaneseDay(day as DayOfWeekType)}
						</div>
						<div className="list-col-grow">
							{shifts.length > 0 ? (
								<ul className="list-disc flex flex-col gap-1 w-full pl-2">
									{shifts.map((position, idx) => (
										<li key={position} className="flex items-center gap-3 ">
											<span className="flex items-center gap-1 text-black">
												<PiUser className="text-[15px]" />{" "}
												<span>{parsePositon(position).amount}</span>
											</span>{" "}
											<span className="text-black opacity-80">
												{parsePositon(position).startTime} -{" "}
												{parsePositon(position).endTime}
											</span>
										</li>
									))}
								</ul>
							) : (
								<p className="text-gray-500 text-sm">シフトなし</p>
							)}
						</div>
						{/* Open the modal using document.getElementById('ID').showModal() method */}
						<button
							type="button"
							className="btn btn-sm rounded-md bg-green03 text-green02 border-none"
							onClick={() => {
								const dialog = document.getElementById(
									`modal_${day}`,
								) as HTMLDialogElement | null;
								dialog?.showModal();
							}}
						>
							追加
						</button>
						<AddWeekShiftModal day={day as DayOfWeekType} shifts={shifts} />
					</li>
				))}
			</ul>
		</div>
	);
};

export default WeekShiftForm;
