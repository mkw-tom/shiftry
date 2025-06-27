import React, { useState } from "react";

export type InputTimeValuesType = {
	startTime: string;
	endTime: string;
};

export type InputSpecificDateType = {
	date: string;
	off: boolean;
	timePick: boolean;
};

const AddSpecificDatesModal = ({
	addSpecificDateToForm,
}: {
	addSpecificDateToForm: (
		inputSpecificDate: InputSpecificDateType,
		inputTimeValues: {
			startTime: string;
			endTime: string;
		},
	) => void;
}) => {
	const [inputTimeValues, setInputTimeValues] = useState({
		startTime: "",
		endTime: "",
	});
	const [inputSpecificDate, setInputSpecificDate] = useState({
		date: "", // "2025-06-12"
		off: false,
		timePick: false,
	});

	const isDisabledAddSpecialDate =
		inputSpecificDate.date === "" ||
		(!inputSpecificDate.off && !inputSpecificDate.timePick) ||
		(inputSpecificDate.timePick && inputTimeValues.startTime === "") ||
		(inputSpecificDate.timePick && inputTimeValues.endTime === "");

	const openAddSpecialDatesModal = () => {
		setInputSpecificDate({ date: "", off: true, timePick: false });
		setInputTimeValues({ startTime: "", endTime: "" });
		const modal = document.getElementById(
			"specific_dates_modal",
		) as HTMLDialogElement | null;
		if (modal) {
			modal.showModal();
		}
	};

	return (
		<>
			<button
				type="submit"
				className="btn btn-sm rounded-md bg-green03 text-green02 border-none"
				onClick={openAddSpecialDatesModal}
			>
				希望を追加
			</button>
			<dialog id="specific_dates_modal" className="modal">
				<div className="modal-box bg-base">
					<h3 className="text-lg text-green01 font-thin">特定日の希望</h3>
					<div className="py-4 flex flex-col gap-7 ">
						<div className="flex flex-col gap-1">
							<div>
								<span>日にちを選択</span>
								<input
									type="date"
									value={inputSpecificDate.date}
									className="input input-sm bg-gray01 mt-1"
									onChange={(e) =>
										setInputSpecificDate((prev) => ({
											...prev,
											date: e.target.value,
										}))
									}
								/>
							</div>
							<div className="flex items-center gap-5 mt-2 pl-1">
								<div className="flex items-center gap-2">
									<input
										type="checkbox"
										className="checkbox checkbox-sm checkbox-success"
										checked={inputSpecificDate.off}
										onChange={(e) =>
											setInputSpecificDate((prev) => ({
												...prev,
												timePick: false,
												off: e.target.checked,
											}))
										}
									/>
									<span className="text-sm font-thin opacity-70 tabular-nums text-black">
										休み
									</span>
								</div>
								<div className="flex items-center gap-2">
									<input
										type="checkbox"
										className="checkbox checkbox-sm checkbox-success"
										checked={inputSpecificDate.timePick}
										onChange={(e) =>
											setInputSpecificDate((prev) => ({
												...prev,
												off: false,
												timePick: e.target.checked,
											}))
										}
									/>
									<span className="text-sm font-thin opacity-70 tabular-nums text-black">
										時間帯を指定
									</span>
								</div>
							</div>
						</div>

						{inputSpecificDate.timePick && (
							<>
								<hr className="text-gray01" />
								<div>
									<span>出勤可能な時間帯</span>
									<div className="flex items-center w-full gap-2 mt-1">
										<label
											htmlFor="start-time"
											className="text-sm text-black w-1/2"
										>
											<input
												type="time"
												className="input bg-gray01 "
												value={inputTimeValues.startTime}
												onChange={(e) =>
													setInputTimeValues((prev) => ({
														...prev,
														startTime: e.target.value,
													}))
												}
											/>
										</label>
										{inputTimeValues.endTime !== "00:00" && (
											<>
												<span className="mt-5 text-black -translate-y-2">
													~
												</span>
												<label
													htmlFor="start-time"
													className="text-sm text-black w-1/2"
												>
													<input
														type="time"
														className="input bg-gray01"
														value={inputTimeValues.endTime}
														onChange={(e) =>
															setInputTimeValues((prev) => ({
																...prev,
																endTime: e.target.value,
															}))
														}
													/>
												</label>
											</>
										)}
									</div>
									<div className="flex items-center gap-2 mt-2 pl-1">
										<input
											type="checkbox"
											className="checkbox checkbox-sm checkbox-success"
											checked={inputTimeValues.endTime === "00:00"}
											onChange={(e) => {
												const checked = e.target.checked;
												setInputTimeValues((prev) => ({
													...prev,
													endTime: checked ? "00:00" : "",
												}));
											}}
										/>
										<span className="text-sm font-thin opacity-70 tabular-nums text-black">
											以降（~24:00）
										</span>
									</div>
								</div>
							</>
						)}
					</div>
					<div className="modal-action">
						<form method="dialog">
							<button
								type="submit"
								className="btn rounded-md border-none mr-1 bg-gray02 text-white"
							>
								中止
							</button>
							<button
								type="submit"
								className="btn rounded-md bg-green03 text-green02 border-none"
								onClick={() =>
									addSpecificDateToForm(inputSpecificDate, inputTimeValues)
								}
								disabled={isDisabledAddSpecialDate}
							>
								追加
							</button>
						</form>
					</div>
				</div>
			</dialog>
		</>
	);
};

export default AddSpecificDatesModal;
