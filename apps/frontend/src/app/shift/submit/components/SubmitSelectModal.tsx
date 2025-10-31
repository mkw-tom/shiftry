import TimeSelecter from "@/app/dashboard/common/components/TimeSelecter";
import type React from "react";
import { type Dispatch, use } from "react";
import { MdCalendarToday } from "react-icons/md";
import { useSubmitShiftForm } from "../context/SubmitShiftFormContextProvider";

const SubmitSelectModal = ({
	closeModal,
	modalTargetDate,
	currentOption,
	setCurrentOption,
	startTime,
	setStartTime,
	endTime,
	setEndTime,
}: {
	closeModal: () => void;
	modalTargetDate: string | null;
	currentOption: "none" | "anytime" | "time";
	setCurrentOption: (option: "none" | "anytime" | "time") => void;
	startTime: string;
	setStartTime: Dispatch<React.SetStateAction<string>>;
	endTime: string;
	setEndTime: Dispatch<React.SetStateAction<string>>;
}) => {
	const { setFormData } = useSubmitShiftForm();
	const setShiftForDate = (date: string, value: string | null) => {
		setFormData((prev) => ({
			...prev,
			shifts: { ...prev.shifts, [date]: value },
		}));
	};

	const handleTimeConfirm = () => {
		if (!modalTargetDate || !startTime || !endTime) return;
		if (startTime >= endTime) {
			alert("終了時刻は開始時刻より後にしてください");
			return;
		}
		setShiftForDate(modalTargetDate, `${startTime}-${endTime}`);
	};

	const handleSaveSelectModal = () => {
		if (!modalTargetDate) return;
		if (currentOption === "time") {
			handleTimeConfirm();
			closeModal();
			return;
		}
		if (currentOption === "anytime") {
			setShiftForDate(modalTargetDate, "anytime");
			closeModal();
			return;
		}
		if (currentOption === "none") {
			setShiftForDate(modalTargetDate, null);
			closeModal();
			return;
		}
	};
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			<div className="modal modal-open">
				<div
					className={`modal-box p-4 bg-white ${
						currentOption === "time" ? "overflow-visible" : "h-auto"
					}`}
				>
					<p className="mb-4 text-green02 font-bold flex items-center gap-2">
						<MdCalendarToday />
						<span>{modalTargetDate}</span>
						<button
							type="button"
							className="btn btn-link btn-xs text-gray02 ml-auto"
							onClick={closeModal}
						>
							キャンセル
						</button>
					</p>

					{/* options（ボタン） */}
					<div className="flex flex-col gap-2 w-full">
						<select
							className="select select-sm select-bordered bg-base text-gray-800 focus:outline-none w-full text-center"
							value={currentOption}
							onChange={(e) => {
								const v = e.target.value as "none" | "anytime" | "time";
								setCurrentOption(v);
							}}
						>
							<option value="none">休み</option>
							<option value="anytime">終日</option>
							<option value="time">時間指定</option>
						</select>
					</div>

					{/* 時間指定 UI */}
					{currentOption === "time" && (
						<div className="flex gap-1 items-center mt-2 w-full ">
							<TimeSelecter
								value={startTime}
								onChange={(newStart) => setStartTime(newStart || "09:00")}
								step={30}
								start="00:00"
								end="23:30"
								btnStyle="btn-sm bg-base w-34"
								color="success"
							/>
							<span className="text-center mx-1 flex-1">~</span>
							<TimeSelecter
								value={endTime}
								onChange={(newEnd) => setEndTime(newEnd || "13:00")}
								step={30}
								start="00:00"
								end="23:30"
								btnStyle="btn-sm bg-base w-34"
								color="success"
							/>
						</div>
					)}
					<button
						type="button"
						className="w-full btn btn-sm btn-success mt-5"
						onClick={handleSaveSelectModal}
					>
						保存
					</button>
				</div>
			</div>
		</div>
	);
};

export default SubmitSelectModal;
