"use client";
import type { RootState } from "@/redux/store.js";
import { MDW, YMDW } from "@shared/utils/formatDate";
import React, { useState } from "react";
import { IoMdArrowRoundBack, IoMdArrowRoundForward } from "react-icons/io";
import { useSelector } from "react-redux";
import { useAdjustShiftForm } from "../context/AdjustShiftFormContextProvider.tsx";

export default function ShiftTableView() {
	const { shiftRequestData, assignShiftData } = useAdjustShiftForm();
	function getDateRange(start: Date, end: Date): string[] {
		const arr: string[] = [];
		const d = new Date(start);
		while (d <= end) {
			arr.push(d.toISOString().slice(0, 10));
			d.setDate(d.getDate() + 1);
		}
		return arr;
	}
	const { members } = useSelector((state: RootState) => state.members);
	const allDates = getDateRange(
		shiftRequestData.weekStart,
		shiftRequestData.weekEnd,
	);
	const [weekStartIdx, setWeekStartIdx] = useState(0);
	const weekDates = allDates
		.slice(weekStartIdx, weekStartIdx + 7)
		.map((d) => new Date(d));

	// 週送り
	const canPrev = weekStartIdx > 0;
	const canNext = weekStartIdx + 7 < allDates.length;
	const handlePrev = () => canPrev && setWeekStartIdx(weekStartIdx - 7);
	const handleNext = () => canNext && setWeekStartIdx(weekStartIdx + 7);

	return (
		<div className="w-full">
			<div className="flex items-center justify-between mx-2 mb-2 gap-2 mt-2">
				<button
					type="button"
					onClick={handlePrev}
					disabled={!canPrev}
					className="btn btn-xs btn-circle bg-green02 border-none"
				>
					<IoMdArrowRoundBack className="text-lg text-white" />
				</button>
				<h3 className="font-bold flex items-center gap-1 text-green02 text-sm">
					<span>{YMDW(new Date(weekDates[0]))}</span>
					<span>〜</span>
					<span>{YMDW(new Date(weekDates[weekDates.length - 1]))}</span>
				</h3>
				<button
					type="button"
					onClick={handleNext}
					disabled={!canNext}
					className="btn btn-xs btn-circle bg-green02 border-none"
				>
					<IoMdArrowRoundForward className="text-lg text-white" />
				</button>
			</div>
			<div className="overflow-x-auto w-full h-[500px] pb-56">
				<table
					className="table border border-gray01 table-fixed"
					style={{ minWidth: `${7 * weekDates.length}rem` }}
				>
					<thead className="sticky top-0 z-10">
						<tr>
							<th className="bg-gray-100 w-10 sticky left-0 z-30 border border-gray01" />
							{weekDates.map((date) => (
								<th
									key={date.toISOString()}
									className="bg-gray-100 text-[11px] text-gray-600 w-10 px-2.5 border border-gray01 break-words max-w-[56px]"
								>
									{MDW(date)}
								</th>
							))}
						</tr>
					</thead>
					<tbody className="">
						{members.map((member) => (
							<tr key={member.user.id}>
								<td className="font-bold flex flex-col items-center gap-1 py-2 bg-white sticky left-0 border border-gray01">
									<img
										src={member.user.pictureUrl ?? ""}
										alt={member.user.name}
										className="w-8 h-8 rounded-full mx-auto"
									/>
									<span className="text-[9px] text-center text-gray-700">
										{member.user.name}
									</span>
								</td>
								{weekDates.map((date) => {
									const dateKey = date.toISOString().slice(0, 10);
									const slots = assignShiftData.shifts[dateKey] || {};
									const assigned = Object.entries(slots).filter(([, slot]) =>
										slot.assigned.some((a) => a.uid === member.user.id),
									);
									return (
										<td
											key={dateKey}
											className="text-xs w-20 text-center align-middle border border-gray01"
										>
											{assigned.length > 0 ? (
												<ul>
													{assigned.map(([time, slot]) => (
														<li key={time} className="flex flex-col">
															<span className="font-semibold text-gray-700">
																{time.split("-")[0]}
															</span>
															<span className="font-semibold text-gray-700">
																{time.split("-")[1]}
															</span>
														</li>
													))}
												</ul>
											) : (
												<span className="text-gray-400">-</span>
											)}
										</td>
									);
								})}
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
