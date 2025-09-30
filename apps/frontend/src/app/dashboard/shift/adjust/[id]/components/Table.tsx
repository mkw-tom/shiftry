"use client";
import { YMDW } from "@shared/utils/formatDate";
import type React from "react";
import { useMemo, useState } from "react";
import { IoMdArrowRoundBack, IoMdArrowRoundForward } from "react-icons/io";
import { useAdjustShiftForm } from "../context/AdjustShiftFormContextProvider.tsx.jsx";

const getDateRange = (start: string, end: string) => {
	const dates: Date[] = [];
	const s = new Date(start);
	const e = new Date(end);
	for (let d = new Date(s); d <= e; d.setDate(d.getDate() + 1)) {
		dates.push(new Date(d));
	}
	return dates;
};

const weekDayLabels = ["日", "月", "火", "水", "木", "金", "土"];

const Table = ({
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
		<div className="w-full mx-auto">
			{/* カレンダーUI */}
			<div className="mx-2 w-auto">
				<div className="flex items-center justify-between mt-2">
					<button
						type="button"
						className="btn btn-xs btn-circle bg-green02 border-none"
						onClick={prevWeek}
						disabled={daysSplitIndex === 0}
					>
						<IoMdArrowRoundBack className="text-lg text-white" />
					</button>
					<h1 className="font-bold flex items-center gap-1 text-green02 text-sm">
						{YMDW(daysWithSevenDays[0])} ~{" "}
						{YMDW(daysWithSevenDays[daysWithSevenDays.length - 1])}
					</h1>
					<button
						type="button"
						className="btn btn-xs btn-circle bg-green02 border-none"
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
				<thead>
					<tr>
						{daysWithSevenDays.map((date, idx) => (
							<th
								key={`weekday-${date.toISOString()}`}
								className="px-1 py-1 text-center border border-gray01 text-sm text-gray-600 bg-gray-100"
							>
								{weekDayLabels[date.getDay()]}
							</th>
						))}
					</tr>
					<tr>
						{daysWithSevenDays.map((date, idx) => (
							<th
								key={`date-${date.toISOString()}`}
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
								{date.toLocaleDateString("ja-JP", {
									month: "2-digit",
									day: "2-digit",
								})}
							</th>
						))}
					</tr>
				</thead>
			</table>
		</div>
	);
};

export default Table;
