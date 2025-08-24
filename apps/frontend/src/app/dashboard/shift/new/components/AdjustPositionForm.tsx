import type { TimeSlotType } from "@shared/api/shift/request/validations/put";
import { MD, MDW } from "@shared/utils/formatDate";
import { convertDateToWeekByJapanese } from "@shared/utils/formatWeek";
import { useState } from "react";
import { IoMdArrowRoundBack, IoMdArrowRoundForward } from "react-icons/io";
import { LuUserRound } from "react-icons/lu";
import { MdAdd } from "react-icons/md";
import { useCreateRequest } from "../context/useCreateRequest";
import AdjustPositionModal from "./AdjustPositionModal";
import PriorityAndAbsoluteModal from "./PriorityAndAbsoluteModal";

const AdjustPositionForm = () => {
	const { formData, setFormData, shiftPositioins, setShiftPositions } =
		useCreateRequest();
	const [editCalendarPositon, setEditCalendarPositon] = useState<TimeSlotType>({
		name: "",
		count: 1,
		jobRoles: [],
		absolute: [],
		priority: [],
	});
	const [editTime, setEditTime] = useState<string>("");

	const openAdjustCalenerPositionModal = (
		position: TimeSlotType,
		date: string,
		time: string | "new",
	) => {
		// setEditIndex(index);
		const modal = document.getElementById(`${date}-${time}-${position.name}`);
		if (modal) {
			(modal as HTMLDialogElement).showModal();
		}
		setEditCalendarPositon(position);
		setEditTime(time);
	};

	const [mode, setMode] = useState<"priority" | "absolute">("priority");

	const openPriorytyAndAbsoluteModal = (
		name: string,
		mode: "priority" | "absolute",
	) => {
		setMode(mode);
		const modal = document.getElementById(
			`modal_${name}_${mode}`,
		) as HTMLDialogElement | null;
		if (modal) {
			modal.showModal();
		}
	};

	const deleteCalenerPosition = (date: string, time: string) => {
		if (!formData.requests) return;
		if (!window.confirm("本当に削除しますか？")) return;
		const updatedRequests = { ...formData.requests };
		if (updatedRequests[date]?.[time]) {
			delete updatedRequests[date][time];
			setFormData((prev) => ({
				...prev,
				requests: updatedRequests,
			}));
		}
	};

	const dateFullRange = (): Date[] => {
		const start = new Date(formData.weekStart);
		const end = new Date(formData.weekEnd);
		const dates: Date[] = [];
		if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()))
			return dates;
		const current = new Date(start);
		while (current <= end) {
			dates.push(new Date(current)); // コピーを入れる
			current.setDate(current.getDate() + 1);
		}
		return dates;
	};

	const [daysSplitIndex, setDaysSplitIndex] = useState<number>(0);
	const daysWithSevenDays = dateFullRange().slice(
		daysSplitIndex * 7,
		7 * (daysSplitIndex + 1),
	);
	const [selecDate, setSelectDate] = useState<Date>(daysWithSevenDays[0]);

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
		<div className="w-full flex flex-col">
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
									date.toDateString() === selecDate?.toDateString()
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
			<AdjustPositionModal
				date={String(selecDate)}
				time={"new"}
				editCalenderrPositon={editCalendarPositon}
				setEditCalendarPosition={setEditCalendarPositon}
				editTime={editTime}
				setEditTime={setEditTime}
			/>
			<div className="w-full flex flex-col gap-1 items-center justify-center shadow-sm  p-1 bg-white">
				<button
					type="button"
					className="btn btn-sm bg-white text-green01 font-bold w-full border-dashed border-1 border-gray01 shadow-none"
					onClick={() =>
						openAdjustCalenerPositionModal(
							editCalendarPositon,
							String(selecDate),
							"new",
						)
					}
				>
					<MdAdd className="text-lg" />
					ポジションを追加
				</button>
			</div>
			<ul className="w-full h-96 overflow-y-auto flex flex-col gap-2 mt-1 pb-50">
				{formData.requests &&
					Object.entries(formData.requests)
						.filter(([date]) => {
							// 選択中の日付（selectDate）と一致する日付のみ表示
							return new Date(date).toDateString() === selecDate.toDateString();
						})
						.flatMap(([date, positionsByTime]) =>
							positionsByTime
								? Object.entries(positionsByTime).map(
										([time, position], index) => (
											<li
												key={`${date}-${time}`}
												className="text-gray01 text-sm flex flex-col items-start gap-1 border-b border-gray01 py-3 px-2"
											>
												<div className="flex items-center justify-between w-full">
													<h1 className="text-gray02 border-l-4 border-l-gray02 font-bold pl-2 w-2/3">
														{position.name}
													</h1>

													<div className="flex items-center">
														<button
															type="button"
															className="btn btn-sm w-12 btn-link text-green01 border-none"
															onClick={() =>
																openAdjustCalenerPositionModal(
																	position,
																	date,
																	time,
																)
															}
														>
															編集
														</button>
														<button
															type="button"
															className="btn  btn-sm w-12 btn-link  text-gray02 border-none"
															onClick={() => deleteCalenerPosition(date, time)}
														>
															削除
														</button>
														<AdjustPositionModal
															time={time}
															date={date}
															editCalenderrPositon={editCalendarPositon}
															setEditCalendarPosition={setEditCalendarPositon}
															editTime={editTime}
															setEditTime={setEditTime}
														/>
													</div>
												</div>
												<div className="w-full flex items-start justify-between px-1">
													<div className="flex items-center">
														<div className="flex items-center gap-3">
															<p className="flex items-center">
																<LuUserRound className="text-black mr-1" />
																<span className="text-black">
																	{position.count}
																</span>
															</p>
															<p className="text-black">
																{time.replace("-", " ~ ")}
															</p>
														</div>
													</div>
													<div className="w-48 flex flex-wrap items-center justify-end gap-1 px-1 mt-1">
														{position.jobRoles.map((role) => (
															<span
																key={role}
																className="badge badge-sm text-white bg-gray02 border-none"
															>
																{role}
															</span>
														))}
													</div>
												</div>

												<PriorityAndAbsoluteModal
													name={position.name}
													mode={mode}
													data={
														mode === "absolute"
															? position.absolute
															: position.priority
													}
												/>

												<div className="w-full h-auto flex  gap-4 items-center justify-end mt-3 pl-2">
													{position.absolute.length > 0 && (
														<div
															className="h-auto flex gap-2 items-center justify-center"
															onClick={() =>
																openPriorytyAndAbsoluteModal(
																	position.name,
																	"absolute",
																)
															}
															onKeyDown={(e) => {
																if (e.key === "Enter" || e.key === " ") {
																	openPriorytyAndAbsoluteModal(
																		position.name,
																		"absolute",
																	);
																}
															}}
														>
															<p className="text-black">固定</p>
															<div className="avatar-group -space-x-1">
																{position.absolute.map((staff) => (
																	<div className="avatar" key={staff.id}>
																		<div className="w-4">
																			<img
																				src={staff.pictureUrl}
																				alt={staff.name}
																			/>
																		</div>
																	</div>
																))}
															</div>
														</div>
													)}

													{position.priority.length > 0 && (
														<div
															className="h-auto flex gap-2  items-center justify-center px-1"
															onClick={() =>
																openPriorytyAndAbsoluteModal(
																	position.name,
																	"priority",
																)
															}
															onKeyDown={(e) => {
																if (e.key === "Enter" || e.key === " ") {
																	openPriorytyAndAbsoluteModal(
																		position.name,
																		"priority",
																	);
																}
															}}
														>
															<p className="text-black">優先</p>
															<div className="avatar-group -space-x-1">
																{position.priority.map((staff) => (
																	<div className="avatar" key={staff.id}>
																		<div className="w-4">
																			<img
																				src={staff.pictureUrl}
																				alt={staff.name}
																			/>
																		</div>
																	</div>
																))}
															</div>
														</div>
													)}
												</div>
											</li>
										),
									)
								: [],
						)}
			</ul>
		</div>
	);
};

export default AdjustPositionForm;

// {
//     "2025-08-25": {
//         "19:00-19:00": {
//             "name": "厨房・ホール",
//             "count": 2,
//             "jobRoles": [
//                 "洗い物",
//                 "レジ"
//             ],
//             "absolute": [
//                 {
//                     "userId": "1",
//                     "userName": "山田太郎"
//                 }
//             ],
//             "priority": []
//         }
//     },
//     "2025-08-26": {
//         "19:00-19:00": {
//             "name": "厨房・ホール",
//             "count": 2,
//             "jobRoles": [
//                 "洗い物",
//                 "レジ"
//             ],
//             "absolute": [
//                 {
//                     "userId": "1",
//                     "userName": "山田太郎"
//                 }
//             ],
//             "priority": []
//         }
//     },
//     "2025-08-27": {
//         "19:00-19:00": {
//             "name": "厨房・ホール",
//             "count": 2,
//             "jobRoles": [
//                 "洗い物",
//                 "レジ"
//             ],
//             "absolute": [
//                 {
//                     "userId": "1",
//                     "userName": "山田太郎"
//                 }
//             ],
//             "priority": []
//         }
//     },
//     "2025-08-28": {
//         "19:00-19:00": {
//             "name": "厨房・ホール",
//             "count": 2,
//             "jobRoles": [
//                 "洗い物",
//                 "レジ"
//             ],
//             "absolute": [
//                 {
//                     "userId": "1",
//                     "userName": "山田太郎"
//                 }
//             ],
//             "priority": []
//         }
//     },
//     "2025-08-29": {
//         "19:00-19:00": {
//             "name": "厨房・ホール",
//             "count": 2,
//             "jobRoles": [
//                 "洗い物",
//                 "レジ"
//             ],
//             "absolute": [
//                 {
//                     "userId": "1",
//                     "userName": "山田太郎"
//                 }
//             ],
//             "priority": []
//         }
//     },
//     "2025-08-30": {
//         "19:00-19:00": {
//             "name": "ホール",
//             "count": 2,
//             "jobRoles": [
//                 "レジ",
//                 "接客"
//             ],
//             "absolute": [
//                 {
//                     "userId": "1",
//                     "userName": "山田太郎"
//                 }
//             ],
//             "priority": []
//         }
//     },
//     "2025-08-31": {
//         "19:00-19:00": {
//             "name": "ホール",
//             "count": 2,
//             "jobRoles": [
//                 "レジ",
//                 "接客"
//             ],
//             "absolute": [
//                 {
//                     "userId": "1",
//                     "userName": "山田太郎"
//                 }
//             ],
//             "priority": []
//         }
//     }
