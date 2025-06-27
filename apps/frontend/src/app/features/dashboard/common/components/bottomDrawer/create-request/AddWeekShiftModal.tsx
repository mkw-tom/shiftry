import React, { useState } from "react";
import { PiUser } from "react-icons/pi";
import { useCreateRequest } from "../../../context/useCreateRequest";

type DayOfWeekType =
	| "Monday"
	| "Tuesday"
	| "Wednesday"
	| "Thursday"
	| "Friday"
	| "Saturday"
	| "Sunday";

type InputValuesType = {
	startTime: string;
	endTime: string;
	amount: number;
};
type EditPositionStateType = {
	status: boolean;
	idx: number;
	startTime: string;
	day: DayOfWeekType;
	endTime: string;
	amount: number;
};

const AddWeekShiftModal = ({
	day,
	shifts,
}: {
	day: DayOfWeekType;
	shifts: string[];
}) => {
	const { setFormData } = useCreateRequest();

	const [inputValues, setInputValues] = useState<InputValuesType>({
		startTime: "",
		endTime: "",
		amount: 0,
	});
	const [edit, setEdit] = useState<EditPositionStateType>({
		status: false,
		day: "Monday",
		idx: 0,
		startTime: "",
		endTime: "",
		amount: 0,
	});
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

	function addPosition(
		day: DayOfWeekType,
		inputValues: { startTime: string; endTime: string; amount: number },
	) {
		if (
			!inputValues.startTime ||
			!inputValues.endTime ||
			!inputValues.amount ||
			inputValues.amount === 0
		) {
			return;
		}
		const { startTime, endTime, amount } = inputValues;
		const time = `${startTime}-${endTime}`;
		const newPosition = `${time}*${amount}`;
		setFormData((prev) => ({
			...prev,
			requests: {
				...prev.requests,
				defaultTimePositions: {
					...prev.requests.defaultTimePositions,
					[day]: [...prev.requests.defaultTimePositions[day], newPosition],
				},
			},
		}));
	}

	function removePosition(day: DayOfWeekType, idx: number) {
		setFormData((prev) => ({
			...prev,
			requests: {
				...prev.requests,
				defaultTimePositions: {
					...prev.requests.defaultTimePositions,
					[day]: prev.requests.defaultTimePositions[day].filter(
						(_, index) => index !== idx,
					),
				},
			},
		}));
	}

	function clearInputValues() {
		setInputValues((prev) => ({
			...prev,
			startTime: "",
			endTime: "",
			amount: 0,
		}));
	}

	function parsePositon(position: string) {
		const [timeRange, people] = position.split("*");
		const [start, end] = timeRange.split("-");
		return {
			startTime: start.trim(),
			endTime: end.trim(),
			amount: people.trim(),
		};
	}

	function editPosition(edit: EditPositionStateType) {
		const { startTime, endTime, amount, day, idx } = edit;
		setFormData((prev) => ({
			...prev,
			requests: {
				...prev.requests,
				defaultTimePositions: {
					...prev.requests.defaultTimePositions,
					[day]: prev.requests.defaultTimePositions[day].map(
						(position, index) => {
							if (index === idx) {
								return `${startTime}-${endTime}*${amount}`;
							}
							return position;
						},
					),
				},
			},
		}));

		closeEdit();
	}

	function closeEdit() {
		setEdit((prev) => ({
			...prev,
			status: false,
			idx: -1,
			startTime: "",
			endTime: "",
			amount: 0,
		}));
	}

	return (
		<dialog id={`modal_${day}`} className="modal">
			<div className="modal-box bg-base">
				<h3 className="text-lg text-black opacity-50 font-thin">
					{getJapaneseDay(day as DayOfWeekType)}
				</h3>
				<div className="py-4 w-full">
					<div
						className={`w-full flex flex-col gap-2 ${
							edit.status ? "opacity-10" : ""
						}`}
					>
						<div className="flex items-center w-full gap-2">
							<label htmlFor="start-time" className="text-sm text-black w-1/2">
								出勤
								<input
									type="time"
									className="input bg-gray01 "
									value={inputValues.startTime}
									onChange={(e) =>
										setInputValues((prev) => ({
											...prev,
											startTime: e.target.value,
										}))
									}
									disabled={edit.status}
								/>
							</label>
							<span className="mt-5 text-black">~</span>
							<label htmlFor="start-time" className="text-sm text-black w-1/2">
								退勤
								<input
									type="time"
									value={inputValues.endTime}
									className="input bg-gray01"
									onChange={(e) =>
										setInputValues((prev) => ({
											...prev,
											endTime: e.target.value,
										}))
									}
									disabled={edit.status}
								/>
							</label>
						</div>
						<label
							htmlFor="people-amont"
							className="text-sm text-black  w-1/2 flex flex-col"
						>
							<span>人数</span>
							<input
								type="number"
								className="input validator bg-gray01"
								value={inputValues.amount === 0 ? "" : inputValues.amount}
								required
								placeholder="半角英数"
								min="1"
								max="20"
								title="Must be between be 1 to 10"
								onChange={(e) =>
									setInputValues((prev) => ({
										...prev,
										amount: Number(e.target.value),
									}))
								}
								disabled={edit.status}
							/>
							<p className="validator-hint">半角英数で入力してください</p>
						</label>
						<div className="w-2/3 flex items-center gap-1 ml-auto mb-5">
							<button
								type="button"
								className="btn btn-sm border-buttom bg-gray02 border-none w-1/3 text-white rounded-md"
								onClick={() => clearInputValues()}
								disabled={edit.status}
							>
								クリア
							</button>
							<button
								type="button"
								className="btn btn-sm border-2 bg-green03 text-green02  w-2/3 border-none rounded-md"
								onClick={() => addPosition(day as DayOfWeekType, inputValues)}
								disabled={
									!inputValues.startTime ||
									!inputValues.endTime ||
									!inputValues.amount ||
									inputValues.amount === 0
								}
							>
								追加
							</button>
						</div>
					</div>
					<hr className="my-2 text-gray01" />
					<ul className="list-disc flex flex-col gap-2 w-full overflow-y-auto max-h-40 pb-20">
						{shifts.length > 0 ? (
							<ul className="list-disc flex flex-col gap-1 w-full">
								{shifts.map((position, idx) => (
									<div key={position} className="w-full">
										{edit.status && edit.idx === idx ? (
											<li
												key={position}
												className="flex flex-col gap-5  py-2 px-3 border-b-1 border-gray01"
											>
												<div className="flex items-center gap-2 ">
													<span className="flex items-center gap-1">
														<PiUser className="text-[15px] text-black" />{" "}
														<input
															type="number"
															className="input input-sm w-13 bg-gray01 text-black"
															value={
																edit.amount === 0
																	? parsePositon(position).startTime
																	: edit.amount
															}
															onChange={(e) =>
																setEdit((prev) => ({
																	...prev,
																	amount: Number(e.target.value),
																}))
															}
														/>
													</span>{" "}
													<div className="flex items-center gap-1">
														<input
															type="time"
															className="input input-sm w-20 bg-gray01 text-black"
															value={
																edit.startTime === ""
																	? parsePositon(position).startTime
																	: edit.startTime
															}
															onChange={(e) =>
																setEdit((prev) => ({
																	...prev,
																	startTime: e.target.value,
																}))
															}
														/>
														<span className=" mt-1 text-black">~</span>
														<input
															type="time"
															className="input input-sm w-20 bg-gray01 text-black"
															value={
																edit.endTime === ""
																	? parsePositon(position).endTime
																	: edit.endTime
															}
															onChange={(e) =>
																setEdit((prev) => ({
																	...prev,
																	endTime: e.target.value,
																}))
															}
														/>
													</div>
												</div>
												<div className="flex items-center gap-1 ml-auto w-2/3">
													<button
														type="button"
														className="btn btn-sm w-1/3 bg-gray02 border-none rounded-md"
														onClick={() => closeEdit()}
													>
														中止
													</button>
													<button
														type="button"
														className="btn btn-sm bg-green03 text-green02 w-2/3 border-none rounded-md"
														onClick={() => editPosition(edit)}
													>
														保存
													</button>
												</div>
											</li>
										) : (
											<li
												key={position}
												className={`flex items-center gap-5  py-2 px-3 border-b-1 border-gray01 ${
													edit.status && edit.idx !== idx ? "opacity-20" : ""
												}`}
											>
												<span className="flex items-center gap-1 text-black">
													<PiUser className="text-[15px]" />{" "}
													<span>{parsePositon(position).amount}</span>
												</span>{" "}
												<div className="text-black">
													{parsePositon(position).startTime} -{" "}
													{parsePositon(position).endTime}
												</div>
												<div className="flex items-center gap-1 ml-auto">
													<button
														type="button"
														className="btn btn-xs bg-gray02 border-none text-white rounded-md"
														onClick={() =>
															removePosition(day as DayOfWeekType, idx)
														}
														disabled={edit.status && edit.idx !== idx}
													>
														削除
													</button>
													<button
														type="button"
														className="btn btn-xs bg-blue01 border-none text-white rounded-md"
														onClick={() =>
															setEdit((prev) => ({
																...prev,
																status: true,
																idx: idx,
																startTime: parsePositon(position).startTime,
																endTime: parsePositon(position).endTime,
																amount: Number(parsePositon(position).amount),
															}))
														}
														disabled={edit.status && edit.idx !== idx}
													>
														編集
													</button>
												</div>
											</li>
										)}
									</div>
								))}
							</ul>
						) : (
							<p className="text-gray-500 text-sm">シフトなし</p>
						)}
					</ul>
				</div>
				<div className="modal-action">
					<form method="dialog">
						<button
							type="submit"
							className="btn bg-gray02 text-white border-none rounded-md"
							disabled={edit.status}
						>
							閉じる
						</button>
					</form>
				</div>
			</div>
		</dialog>
	);
};

export default AddWeekShiftModal;
