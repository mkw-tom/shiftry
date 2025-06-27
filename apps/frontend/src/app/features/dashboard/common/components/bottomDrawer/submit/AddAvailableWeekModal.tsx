import type { UpsertSubmittedShiftInputType } from "@shared/shift/submit/validations/put";
import React, { useState } from "react";
import type { DayOfWeekType } from "./Submit";

const AddAvailableWeekModal = ({
	day,
	formData,
	parseTimeRange,
	UpdateAvailableWeekTime,
	RemoveAvailableWeekTime,
}: {
	day: DayOfWeekType;
	formData: UpsertSubmittedShiftInputType;
	parseTimeRange: (data: string) =>
		| {
				day: string;
				startTime?: undefined;
				endTime?: undefined;
		  }
		| {
				day: string;
				startTime: string;
				endTime: string;
		  };
	UpdateAvailableWeekTime: (
		day: DayOfWeekType,
		startTime: string,
		endTime: string,
	) => void;
	RemoveAvailableWeekTime: (day: DayOfWeekType) => void;
}) => {
	const [inputTimeValues, setInputTimeValues] = useState({
		startTime: "",
		endTime: "",
	});

	const openAvailableWeekModal = (day: DayOfWeekType) => {
		clearInputTimeValues();
		const modal = document.getElementById(
			`available_week_modal_${day}`,
		) as HTMLDialogElement | null;
		const entry = formData.shifts.availableWeeks.find(
			(d) => d.startsWith(day) && d.includes("&"),
		);
		const parsed = entry
			? parseTimeRange(entry)
			: { startTime: "", endTime: "" };

		setInputTimeValues({
			startTime: parsed.startTime || "",
			endTime: parsed.endTime || "",
		});

		if (modal) {
			modal.showModal();
		}
	};

	const clearInputTimeValues = () => {
		setInputTimeValues({ startTime: "", endTime: "" });
	};

	const isDisabledAddTime =
		inputTimeValues.startTime === "" || inputTimeValues.endTime === "";

	return (
		<>
			<button
				type="button"
				className={`btn btn-sm rounded-md  border-none ${
					!formData.shifts.availableWeeks.some((d) => d.startsWith(day))
						? "bg-gray01"
						: " bg-green03 text-green02"
				}`}
				onClick={() => openAvailableWeekModal(day as DayOfWeekType)}
				disabled={
					!formData.shifts.availableWeeks.some((d) => d.startsWith(day))
				}
			>
				時間指定
			</button>
			<dialog id={`available_week_modal_${day}`} className="modal">
				<div className="modal-box bg-base w-11/12 max-w-5xl">
					<h3 className="text-lg text-black opacity-50 font-thin">
						出勤可能な時間帯
					</h3>

					<div className="flex items-center w-full gap-2 mt-4">
						<label htmlFor="start-time" className="text-sm text-black w-1/2">
							{/* 出勤 */}
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
								// disabled={edit.status}
							/>
						</label>
						{inputTimeValues.endTime !== "00:00" && (
							<>
								<span className="mt-5 text-black -translate-y-2">~</span>
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
										// disabled={edit.status}
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
									endTime: checked ? "00:00" : "", // ← チェック時は"24:00"、外したらリセット（必要に応じて前の値などに）
								}));
							}}
						/>
						<span className="text-sm font-thin opacity-70 tabular-nums text-black">
							以降（~24:00）
						</span>
					</div>
					<div className="modal-action">
						<form method="dialog">
							{formData.shifts.availableWeeks
								.filter((data) => data.startsWith(`${day}&`))
								.map((entry) => (
									<button
										key={entry}
										type="submit"
										className="btn bg-error text-white border-none rounded-md mr-2"
										onClick={() => {
											RemoveAvailableWeekTime(day as DayOfWeekType);
											clearInputTimeValues();
										}}
									>
										取り消す
									</button>
								))}
							<button
								type="submit"
								className="btn bg-gray02 text-white border-none rounded-md mr-2"
								onClick={() => clearInputTimeValues()}
							>
								戻る
							</button>
							<button
								type="submit"
								className="btn bg-green03 text-green02 border-none rounded-md"
								disabled={isDisabledAddTime}
								onClick={() =>
									UpdateAvailableWeekTime(
										day as DayOfWeekType,
										inputTimeValues.startTime,
										inputTimeValues.endTime,
									)
								}
							>
								保存
							</button>
						</form>
					</div>
				</div>
			</dialog>
		</>
	);
};

export default AddAvailableWeekModal;
