import { YMDW } from "@/app/features/common/hooks/useFormatDate";
import type React from "react";
import { useState } from "react";
import { PiUser } from "react-icons/pi";
import { useCreateRequest } from "../../../context/useCreateRequest";

type InputValuesType = {
	startTime: string;
	endTime: string;
	amount: number;
};
type EditPositionStateType = {
	status: boolean;
	idx: number;
	startTime: string;
	day: string;
	endTime: string;
	amount: number;
};

const AddSpecialShiftModal = ({
	day,
	shifts,
	setOpenAddSpecialShiftModal,
	inputDay,
	setInputDay,
}: {
	day: string;
	shifts: string[];
	setOpenAddSpecialShiftModal: React.Dispatch<React.SetStateAction<boolean>>;
	inputDay: string;
	setInputDay: React.Dispatch<React.SetStateAction<string>>;
}) => {
	const { setFormData } = useCreateRequest();

	const [inputValues, setInputValues] = useState<InputValuesType>({
		startTime: "",
		endTime: "",
		amount: 0,
	});
	const [edit, setEdit] = useState<EditPositionStateType>({
		status: false,
		day: "",
		idx: 0,
		startTime: "",
		endTime: "",
		amount: 0,
	});
	function addPosition(
		day: string,
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
		const newShift = `${time}*${amount}`;
		setFormData((prev) => {
			const prevShifts = prev.requests.overrideDates[day] ?? [];

			return {
				...prev,
				requests: {
					...prev.requests,
					overrideDates: {
						...prev.requests.overrideDates,
						[day]: [...prevShifts, newShift],
					},
				},
			};
		});
	}

	function removePosition(day: string, idx: number) {
		setFormData((prev) => ({
			...prev,
			requests: {
				...prev.requests,
				overrideDates: {
					...prev.requests.overrideDates,
					[day]: prev.requests.overrideDates[day].filter(
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
		setFormData((prev) => {
			const prevShifts = prev.requests.overrideDates?.[day] ?? [];

			const updatedShifts = prevShifts.map((position, index) => {
				if (index === idx) {
					return `${startTime}-${endTime}*${amount}`;
				}
				return position;
			});

			return {
				...prev,
				requests: {
					...prev.requests,
					overrideDates: {
						...prev.requests.overrideDates,
						[day]: updatedShifts,
					},
				},
			};
		});

		closeEdit();
	}

	function removeOverrideDay(day: string) {
		setFormData((prev) => {
			// shallow copy してから削除
			const updatedOverrideDates = { ...prev.requests.overrideDates };
			delete updatedOverrideDates[day];

			return {
				...prev,
				requests: {
					...prev.requests,
					overrideDates: updatedOverrideDates,
				},
			};
		});
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
		setOpenAddSpecialShiftModal(false);
	}

	return (
		<dialog id={`modal_${day}`} className="modal">
			<div className="modal-box bg-base">
				<h3 className="text-lg text-black opacity-50 font-thin">
					{YMDW(new Date(day))}
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
								className="btn btn-sm border-buttom bg-gray02 border-none w-1/3 text-white rounded-full"
								onClick={() => clearInputValues()}
								disabled={edit.status}
							>
								クリア
							</button>
							<button
								type="button"
								className="btn btn-sm border-2 bg-green03 text-green02  w-2/3 border-none rounded-full"
								onClick={() => addPosition(day as string, inputValues)}
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
														className="btn btn-sm w-1/3 bg-gray02 border-none rounded-full"
														onClick={() => closeEdit()}
													>
														中止
													</button>
													<button
														type="button"
														className="btn btn-sm bg-green03 text-green02 w-2/3 border-none rounded-full"
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
													edit.status && edit.idx !== idx
														? "opacity-20 hidden"
														: ""
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
												<div className="flex items-center gap-1 ml-auto ">
													<button
														type="button"
														className="btn btn-xs bg-gray02 border-none text-white rounded-full"
														onClick={() => removePosition(day, idx)}
														disabled={edit.status && edit.idx !== idx}
													>
														削除
													</button>
													<button
														type="button"
														className="btn btn-xs bg-blue01 border-none text-white rounded-full"
														onClick={() =>
															setEdit((prev) => ({
																...prev,
																status: true,
																day: day,
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
						{inputDay === "" ? (
							<button
								type="submit"
								className="btn btn-error text-white mr-1 rounded-full"
								onClick={() => {
									if (
										confirm(`${YMDW(new Date(day))}のデータを削除しますか？`)
									) {
										removeOverrideDay(day);
									}
								}}
							>
								<span>削除</span>
							</button>
						) : (
							<button
								type="submit"
								className="btn bg-gray01 rounded-full"
								onClick={() => {
									const dialog = document.getElementById(
										"special_modal",
									) as HTMLDialogElement | null;
									dialog?.showModal();
									setOpenAddSpecialShiftModal(false);
									removeOverrideDay(day);
								}}
							>
								戻る
							</button>
						)}

						<button
							type="submit"
							className={`btn   border-none rounded-full ${
								shifts.length === 0
									? "pointer-events-none bg-gray01 text-gray02 "
									: "bg-gray02 text-white "
							}`}
							disabled={edit.status}
							onClick={() => {
								setInputDay("");
								setOpenAddSpecialShiftModal(false);
							}}
						>
							閉じる
						</button>
					</form>
				</div>
			</div>
		</dialog>
	);
};

export default AddSpecialShiftModal;
