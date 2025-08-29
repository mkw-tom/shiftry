// import { format } from "node:path";
// import type { bulkUpsertShiftPositionType } from "@shared/api/shiftPosition/validations/put-bulk";
// import { MD, MDW } from "@shared/utils/formatDate";
// import { convertDateToWeekByJapanese } from "@shared/utils/formatWeek";
// import { ja } from "date-fns/locale";
// import React, { use, useEffect, useState } from "react";
// import { DayPicker } from "react-day-picker";
// import { BsArrowLeft } from "react-icons/bs";
// import { IoMdArrowRoundBack, IoMdArrowRoundForward } from "react-icons/io";
// import {
// 	IoArrowBackCircleSharp,
// 	IoArrowForwardCircleSharp,
// } from "react-icons/io5";
// import { LuUserRound } from "react-icons/lu";
// import { date } from "zod/v4-mini";
// import {
// 	dummyShiftPositions,
// 	useCreateRequest,
// } from "../../../context/useCreateRequest";

// const AdjustPositionForm = () => {
// 	const { formData } = useCreateRequest();
// 	const [shiftPositioins, setShiftPositions] =
// 		useState<bulkUpsertShiftPositionType>(dummyShiftPositions);

// 	const dateFullRange = (): Date[] => {
// 		const start = new Date(formData.weekStart);
// 		const end = new Date(formData.weekEnd);
// 		const dates: Date[] = [];

// 		// 無効な日付チェック
// 		if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()))
// 			return dates;

// 		const current = new Date(start);
// 		while (current <= end) {
// 			dates.push(new Date(current)); // コピーを入れる
// 			current.setDate(current.getDate() + 1);
// 		}

// 		return dates;
// 	};

// 	const [daysSplitIndex, setDaysSplitIndex] = useState<number>(0);

// 	const daysWithSevenDays = dateFullRange().slice(
// 		daysSplitIndex * 7,
// 		7 * (daysSplitIndex + 1),
// 	);

// 	const [selecDate, setSelectDate] = useState<Date>(daysWithSevenDays[0]);

// 	const prevWeek = () => {
// 		if (daysSplitIndex > 0) {
// 			setDaysSplitIndex(daysSplitIndex - 1);
// 		}
// 		setSelectDate(daysWithSevenDays[0]);
// 	};
// 	const nextWeek = () => {
// 		const currentLength = 7 * (daysSplitIndex + 1);

// 		if (currentLength < dateFullRange().length) {
// 			setDaysSplitIndex(daysSplitIndex + 1);
// 		}
// 		setSelectDate(daysWithSevenDays[0]);
// 	};

// 	return (
// 		<div className="w-full flex flex-col">
// 			<div className="mx-2 w-auto">
// 				<div className="flex items-center justify-between mt-2">
// 					<button
// 						type="button"
// 						className="btn btn-xs btn-circle btn-success"
// 						onClick={prevWeek}
// 						disabled={daysSplitIndex === 0}
// 					>
// 						<IoMdArrowRoundBack className="text-lg text-white" />
// 					</button>
// 					<h1 className="font-bold text-gray-800">
// 						{MDW(daysWithSevenDays[0])} ~{" "}
// 						{MDW(daysWithSevenDays[daysWithSevenDays.length - 1])}
// 					</h1>
// 					<button
// 						type="button"
// 						className="btn btn-xs btn-circle btn-success"
// 						onClick={nextWeek}
// 						disabled={
// 							daysWithSevenDays.length < 7 || dateFullRange().length <= 7
// 						}
// 					>
// 						<IoMdArrowRoundForward className="text-lg text-white" />
// 					</button>
// 				</div>
// 			</div>
// 			<table className="table-auto w-full border border-gray01 border-collapse mt-2">
// 				<thead className="">
// 					<tr>
// 						{daysWithSevenDays.map((date, idx) => (
// 							<th
// 								key={`weekday-${date}`}
// 								className="px-1 py-1 text-center border border-gray01 text-sm text-gray-600 bg-gray-100"
// 							>
// 								{convertDateToWeekByJapanese(
// 									String(date).toLowerCase(),
// 									"short",
// 								)}{" "}
// 							</th>
// 						))}
// 					</tr>
// 					<tr>
// 						{daysWithSevenDays.map((date, idx) => (
// 							<th
// 								key={`date-${date}`}
// 								onClick={() => setSelectDate(date)}
// 								className={`px-1 py-1 border border-gray01 text-gray-700 text-center text-sm cursor-pointer transition-colors hover:bg-gray01 ${
// 									date.toDateString() === selecDate?.toDateString()
// 										? "bg-success"
// 										: "bg-white"
// 								}`}
// 								onKeyDown={(e) => {
// 									if (e.key === "Enter") {
// 										setSelectDate(date);
// 									}
// 								}}
// 							>
// 								{MD(date)}
// 							</th>
// 						))}
// 					</tr>
// 				</thead>
// 			</table>
// 			<ul className="w-full h-96 overflow-y-auto flex flex-col gap-2 mt-1">
// 				{formData.requests &&
// 					Object.entries(formData.requests)
// 						.filter(([date]) => {
// 							// 選択中の日付（selectDate）と一致する日付のみ表示
// 							return new Date(date).toDateString() === selecDate.toDateString();
// 						})
// 						.flatMap(([date, positionsByTime]) =>
// 							positionsByTime
// 								? Object.entries(positionsByTime).map(
// 										([time, position], index) => (
// 											<li
// 												key={`${date}-${time}`}
// 												className="text-gray01 text-sm flex flex-col items-start gap-1 border-b border-gray01 py-3 px-1"
// 											>
// 												<div className="flex items-center justify-between w-full">
// 													<h1 className="text-gray02 border-l-4 border-l-gray02 font-bold pl-2 w-2/5">
// 														{position.name}
// 													</h1>
// 													<div className="flex items-center">
// 														<div className="flex items-center gap-3">
// 															<p className="flex items-center">
// 																<LuUserRound className="text-black mr-1" />
// 																<span className="text-black">
// 																	{position.count}
// 																</span>
// 															</p>
// 															<p className="text-black">
// 																{time.replace("-", " ~ ")}
// 															</p>
// 														</div>
// 													</div>
// 													<div className="flex items-center">
// 														<button
// 															type="button"
// 															className="btn btn-sm w-12 btn-link text-green01 border-none"
// 														>
// 															編集
// 														</button>
// 													</div>
// 												</div>
// 												<div className="flex items-center gap-1 px-1 mt-1">
// 													{position.jobRoles.map((role) => (
// 														<span
// 															key={role}
// 															className="badge text-white bg-gray02 border-none"
// 														>
// 															{role}
// 														</span>
// 													))}
// 												</div>
// 											</li>
// 										),
// 									)
// 								: [],
// 						)}
// 			</ul>
// 		</div>
// 	);
// };

// export default AdjustPositionForm;
