import { useToast } from "@/app/dashboard/common/context/ToastProvider";
import { YMDW } from "@shared/utils/formatDate";
import React, { use, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ja } from "date-fns/locale";
import { useAdjustShiftForm } from "../../context/AdjustShiftFormContextProvider.tsx";
import { useAutoAssign } from "../../hook/useAutoAssign";

const AutoAssignModal = () => {
	const { shiftRequestData, assignShiftData, setAssignShiftData } =
		useAdjustShiftForm();
	const [datePicking, setDatePicking] = useState(false);
	const [checkedFields, setCheckedFields] = useState<string[]>([]);
	const [successAssign, setSuccessAssign] = useState<boolean>(false);
	// 割当期間の選択
	const [assignRange, setAssignRange] = useState<"all" | "range" | "single">(
		"all",
	);
	const [rangeStart, setRangeStart] = useState<Date | null>(null);
	const [rangeEnd, setRangeEnd] = useState<Date | null>(null);
	const [singleDate, setSingleDate] = useState<Date | null>(null);

	const { autoAssignFunc, isLoading } = useAutoAssign({
		assignShiftData,
		shiftRequestData,
		setAssignShiftData,
	});
	const { showToast } = useToast();

	const checkFunc = (targetField: "absolute" | "priority") => {
		if (checkedFields.includes(targetField)) {
			const newCheckedFields = checkedFields.filter(
				(field) => field !== targetField,
			);
			setCheckedFields(newCheckedFields);
		} else {
			const newCheckedFields = [...checkedFields, targetField];
			setCheckedFields(newCheckedFields);
		}
	};
	const onCloseAutoAssignModal = () => {
		const modal = document.getElementById(
			`auto-assign-${shiftRequestData.id}`,
		) as HTMLDialogElement | null;
		modal?.close();
	};

	// 入力バリデーション
	const isInputValid = () => {
		if (assignRange === "range") {
			return !!rangeStart && !!rangeEnd;
		}
		if (assignRange === "single") {
			return !!singleDate;
		}
		return true;
	};

	function formatDateLocal(date: Date) {
		// YYYY-MM-DD（ローカルタイム）で返す
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const day = String(date.getDate()).padStart(2, "0");
		return `${year}-${month}-${day}`;
	}

	const handleAutoAssign = async () => {
		setSuccessAssign(false);
		let period: {
			type: "all" | "range" | "single";
			start?: string;
			end?: string;
			date?: string;
		} = { type: assignRange };
		if (assignRange === "range" && rangeStart && rangeEnd) {
			period = {
				type: "range",
				start: formatDateLocal(rangeStart),
				end: formatDateLocal(rangeEnd),
			};
		} else if (assignRange === "single" && singleDate) {
			period = {
				type: "single",
				date: formatDateLocal(singleDate),
			};
		}
		if (!isInputValid()) return;
		autoAssignFunc(checkedFields, period);
		setSuccessAssign(true);
	};

	useEffect(() => {
		if (!isLoading && successAssign) {
			// モーダルを閉じる
			const modal = document.getElementById(
				`auto-assign-${shiftRequestData.id}`,
			) as HTMLDialogElement | null;
			modal?.close();
			// トースト表示
			showToast("自動割当が完了しました", "success");
			setSuccessAssign(false);
		}
	}, [isLoading, successAssign, showToast, shiftRequestData.id]);

	return (
		<>
			<dialog
				id={`auto-assign-${shiftRequestData.id}`}
				className="modal modal-middle z-40"
			>
				<div
					className={`modal-box max-w-xs bg-white ${
						datePicking ? "h-[500px]" : "h-auto"
					}`}
				>
					<button
						type="button"
						className="btn btn-sm btn-circle absolute right-2 top-2 shadow-none bg-white text-gray02 border border-gray02"
						disabled={isLoading}
						onClick={() => onCloseAutoAssignModal()}
					>
						✕
					</button>
					<h3 className="font-bold  text-gray-600 mb-1">シフト自動割当</h3>
					<h3 className="text-gray-600 text-sm mb-3 ml-1">
						{YMDW(shiftRequestData.weekStart)} ~{" "}
						{YMDW(shiftRequestData.weekEnd)}
					</h3>
					{/* 割当期間選択 */}
					<div className="mb-4">
						<div className="flex gap-2 mb-2">
							<label className="flex items-center gap-1">
								<input
									type="radio"
									name="assignRange"
									value="all"
									checked={assignRange === "all"}
									onChange={() => setAssignRange("all")}
									className="radio radio-sm radio-success"
								/>
								<span className="text-sm text-gray-700">全体</span>
							</label>
							<label className="flex items-center gap-1">
								<input
									type="radio"
									name="assignRange"
									value="range"
									checked={assignRange === "range"}
									onChange={() => setAssignRange("range")}
									className="radio radio-sm radio-success"
								/>
								<span className="text-sm text-gray-700">特定期間</span>
							</label>
							<label className="flex items-center gap-1">
								<input
									type="radio"
									name="assignRange"
									value="single"
									checked={assignRange === "single"}
									onChange={() => setAssignRange("single")}
									className="radio radio-sm radio-success"
								/>
								<span className="text-sm text-gray-700">1日だけ</span>
							</label>
						</div>
						{assignRange === "range" && (
							<div className="flex flex-col gap-2 mb-2 items-center my-5">
								<DatePicker
									locale={ja}
									selected={rangeStart}
									placeholderText="日付を選択"
									onChange={(date) => {
										if (date) setRangeStart(date);
									}}
									selectsStart
									startDate={rangeStart}
									endDate={rangeEnd}
									minDate={
										shiftRequestData.weekStart
											? new Date(shiftRequestData.weekStart)
											: undefined
									}
									maxDate={
										shiftRequestData.weekEnd
											? new Date(shiftRequestData.weekEnd)
											: undefined
									}
									dateFormat="yyyy-MM-dd"
									className="input text-[16px] border border-gray01 focus:outline-none focus:ring-0 focus:border-gray01 bg-base text-gray-700"
									onCalendarOpen={() => setDatePicking(true)}
									onCalendarClose={() => setDatePicking(false)}
								/>
								<span className="text-gray-500">から</span>
								<DatePicker
									locale={ja}
									selected={rangeEnd}
									placeholderText="日付を選択"
									onChange={(date) => {
										if (date) setRangeEnd(date);
									}}
									selectsEnd
									startDate={rangeStart}
									endDate={rangeEnd}
									minDate={
										shiftRequestData.weekStart
											? new Date(shiftRequestData.weekStart)
											: undefined
									}
									maxDate={
										shiftRequestData.weekEnd
											? new Date(shiftRequestData.weekEnd)
											: undefined
									}
									dateFormat="yyyy-MM-dd"
									className="input text-[16px] border border-gray01 focus:outline-none focus:ring-0 focus:border-gray01 bg-base text-gray-700 "
									onCalendarOpen={() => setDatePicking(true)}
									onCalendarClose={() => setDatePicking(false)}
								/>
							</div>
						)}
						{assignRange === "single" && (
							<div className="flex flex-col gap-2 mb-2 items-center jusify-center my-5">
								<DatePicker
									locale={ja}
									selected={singleDate}
									placeholderText="日付を選択"
									onChange={(date) => {
										if (date === null) alert("日付が正しく選択されていません");
										if (date) setSingleDate(date);
									}}
									minDate={
										shiftRequestData.weekStart
											? new Date(shiftRequestData.weekStart)
											: undefined
									}
									maxDate={
										shiftRequestData.weekEnd
											? new Date(shiftRequestData.weekEnd)
											: undefined
									}
									dateFormat="yyyy-MM-dd"
									className="input text-[16px] border border-gray01 focus:outline-none focus:ring-0 focus:border-gray01 bg-base text-gray-700"
									onCalendarOpen={() => setDatePicking(true)}
									onCalendarClose={() => setDatePicking(false)}
								/>
							</div>
						)}
					</div>
					<div className="flex items-center gap-4 mb-6">
						<label className="flex items-center gap-2 cursor-pointer">
							<input
								type="checkbox"
								className="checkbox checkbox-sm checkbox-success"
								checked={!!checkedFields.includes("absolute")}
								onChange={() => checkFunc("absolute")}
								disabled={isLoading}
							/>
							<span className="text-gray-700 text-sm">固定</span>
						</label>
						<label className="flex items-center gap-2 cursor-pointer">
							<input
								type="checkbox"
								className="checkbox checkbox-sm checkbox-success"
								value={"priority"}
								checked={!!checkedFields.includes("priority")}
								onChange={() => checkFunc("priority")}
								disabled={isLoading}
							/>
							<span className="text-gray-700 text-sm">優先</span>
						</label>
					</div>
					<button
						type="button"
						className={`btn border-green01 text-green01 bg-white btn-block shadow-none bg-none ${
							(checkedFields.length === 0 || !isInputValid()) && "opacity-40"
						}`}
						onClick={() => handleAutoAssign()}
						disabled={
							isLoading || checkedFields.length === 0 || !isInputValid()
						}
					>
						{isLoading ? (
							<span className="loading loading-dots" />
						) : (
							"自動割当を実行"
						)}
					</button>
				</div>
			</dialog>
		</>
	);
};

export default AutoAssignModal;
