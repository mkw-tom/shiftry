import { MD, MDW } from "@shared/utils/formatDate";
import { convertDateToWeekByJapanese } from "@shared/utils/formatWeek";
import type React from "react";
import { IoMdArrowRoundBack, IoMdArrowRoundForward } from "react-icons/io";

const CalenderTable = ({
	selectDate,
	setSelectDate,
	dateFullRange,
	daysWithSevenDays,
	daysSplitIndex,
	setDaysSplitIndex,
}: {
	selectDate: Date;
	setSelectDate: React.Dispatch<React.SetStateAction<Date>>;
	dateFullRange: () => Date[];
	daysWithSevenDays: Date[];
	daysSplitIndex: number;
	setDaysSplitIndex: React.Dispatch<React.SetStateAction<number>>;
}) => {
	const prevWeek = () => {
		if (daysSplitIndex > 0) {
			setDaysSplitIndex(daysSplitIndex - 1);
		}
		setSelectDate(daysWithSevenDays[0]);
	};
	const nextWeek = () => {
		const currentLength = 7 * (daysSplitIndex + 1);

		if (currentLength < dateFullRange().length) {
			setDaysSplitIndex(daysSplitIndex + 1);
		}
		setSelectDate(daysWithSevenDays[0]);
	};

	return (
		<>
			<div className="mx-2 w-auto">
				<div className="flex items-center justify-between mt-2">
					<button
						type="button"
						className="btn btn-xs btn-circle btn-success"
						onClick={prevWeek}
						disabled={daysSplitIndex === 0}
					>
						<IoMdArrowRoundBack className="text-lg text-white" />
					</button>
					<h1 className="font-bold text-gray-800">
						{MDW(daysWithSevenDays[0])} ~{" "}
						{MDW(daysWithSevenDays[daysWithSevenDays.length - 1])}
					</h1>
					<button
						type="button"
						className="btn btn-xs btn-circle btn-success"
						onClick={nextWeek}
						disabled={
							daysWithSevenDays.length < 7 || dateFullRange().length <= 7
						}
					>
						<IoMdArrowRoundForward className="text-lg text-white" />
					</button>
				</div>
			</div>
			<table className="table-auto w-full border border-gray01 border-collapse mt-2">
				<thead className="">
					<tr>
						{daysWithSevenDays.map((date, idx) => (
							<th
								key={`weekday-${date}`}
								className="px-1 py-1 text-center border border-gray01 text-sm text-gray-600 bg-gray-100"
							>
								{convertDateToWeekByJapanese(
									String(date).toLowerCase(),
									"short",
								)}{" "}
							</th>
						))}
					</tr>
					<tr>
						{daysWithSevenDays.map((date, idx) => (
							<th
								key={`date-${date}`}
								onClick={() => setSelectDate(date)}
								className={`px-1 py-1 border border-gray01 text-gray-700 text-center text-sm cursor-pointer transition-colors hover:bg-gray01 ${
									date.toDateString() === selectDate?.toDateString()
										? "bg-success"
										: "bg-white"
								}`}
								onKeyDown={(e) => {
									if (e.key === "Enter") {
										setSelectDate(date);
									}
								}}
							>
								{MD(date)}
							</th>
						))}
					</tr>
				</thead>
			</table>
		</>
	);
};

export default CalenderTable;
