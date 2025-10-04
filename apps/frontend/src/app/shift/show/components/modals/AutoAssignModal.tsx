import { useToast } from "@/app/dashboard/common/context/ToastProvider";
import { YMDW } from "@shared/utils/formatDate";
import React, { use, useEffect, useState } from "react";
import { useAdjustShiftForm } from "../../context/AdjustShiftFormContextProvider.tsx";
import { useAutoAssign } from "../../hook/useAutoAssign";

const AutoAssignModal = () => {
	const { shiftRequestData, assignShiftData, setAssignShiftData } =
		useAdjustShiftForm();
	const [checkedFields, setCheckedFields] = useState<string[]>([]);
	const [successAssign, setSuccessAssign] = useState<boolean>(false);
	// 割当期間の選択
	const [assignRange, setAssignRange] = useState<"all" | "range" | "single">(
		"all",
	);
	const [rangeStart, setRangeStart] = useState<string>("");
	const [rangeEnd, setRangeEnd] = useState<string>("");
	const [singleDate, setSingleDate] = useState<string>("");

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

	const handleAutoAssign = async () => {
		setSuccessAssign(false);
		let period: {
			type: "all" | "range" | "single";
			start?: string;
			end?: string;
			date?: string;
		} = { type: assignRange };
		if (assignRange === "range") {
			period = { type: "range", start: rangeStart, end: rangeEnd };
		} else if (assignRange === "single") {
			period = { type: "single", date: singleDate };
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
				className="modal modal-middle"
			>
				<div className="modal-box max-w-xs bg-white">
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
							<div className="flex gap-2 mb-2">
								<input
									type="date"
									className="input input-sm border border-gray02 focus:outline-none focus:ring-0 focus:border-gray02 bg-base text-gray-700"
									value={rangeStart}
									min={
										shiftRequestData.weekStart
											? new Date(shiftRequestData.weekStart)
													.toISOString()
													.slice(0, 10)
											: undefined
									}
									max={
										shiftRequestData.weekEnd
											? new Date(shiftRequestData.weekEnd)
													.toISOString()
													.slice(0, 10)
											: undefined
									}
									onChange={(e) => setRangeStart(e.target.value)}
								/>
								<span className="text-gray-500">~</span>
								<input
									type="date"
									className="input input-sm border border-gray02 focus:outline-none focus:ring-0 focus:border-gray02 bg-base text-gray-700"
									value={rangeEnd}
									min={
										shiftRequestData.weekStart
											? new Date(shiftRequestData.weekStart)
													.toISOString()
													.slice(0, 10)
											: undefined
									}
									max={
										shiftRequestData.weekEnd
											? new Date(shiftRequestData.weekEnd)
													.toISOString()
													.slice(0, 10)
											: undefined
									}
									onChange={(e) => setRangeEnd(e.target.value)}
								/>
							</div>
						)}
						{assignRange === "single" && (
							<div className="flex gap-2 mb-2">
								<input
									type="date"
									className="input input-sm border border-gray02 focus:outline-none focus:ring-0 focus:border-gray02 bg-base text-gray-700"
									value={singleDate}
									min={
										shiftRequestData.weekStart
											? new Date(shiftRequestData.weekStart)
													.toISOString()
													.slice(0, 10)
											: undefined
									}
									max={
										shiftRequestData.weekEnd
											? new Date(shiftRequestData.weekEnd)
													.toISOString()
													.slice(0, 10)
											: undefined
									}
									onChange={(e) => setSingleDate(e.target.value)}
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
