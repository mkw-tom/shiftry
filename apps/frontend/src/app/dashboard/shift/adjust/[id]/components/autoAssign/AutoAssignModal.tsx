import { useToast } from "@/app/dashboard/common/context/ToastProvider";
import { YMDW } from "@shared/utils/formatDate";
import React, { use, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useAutoAdjust } from "@/app/api/hook/useAutoAdjust";
import type { RootState } from "@/redux/store.js";
import type {
	AutoShiftAdjustRequest,
	MemberProfileType,
} from "@shared/api/shift/adjust/validations/auto.js";
import { ja, te } from "date-fns/locale";
import { useSelector } from "react-redux";
import { useAdjustShiftForm } from "../../context/AdjustShiftFormContextProvider.tsx";
import { useAutoAdjustMode } from "../../context/AutoAdjustModeProvider";

const AIAssignModal = () => {
	const {
		shiftRequestData,
		assignShiftData,
		setAssignShiftData,
		submittedShiftList,
	} = useAdjustShiftForm();
	const { autoAdjust, isLoading, error } = useAutoAdjust();
	const { members } = useSelector((state: RootState) => state.members);
	const { startAutoAdjustMode } = useAutoAdjustMode();
	const [datePicking, setDatePicking] = useState(false);
	// const [checkedFields, setCheckedFields] = useState<string[]>([]);
	const [successAssign, setSuccessAssign] = useState<boolean>(false);
	// 割当期間の選択
	const [assignRange, setAssignRange] = useState<"all" | "range" | "single">(
		"all",
	);
	const [rangeStart, setRangeStart] = useState<Date | null>(null);
	const [rangeEnd, setRangeEnd] = useState<Date | null>(null);
	const [singleDate, setSingleDate] = useState<Date | null>(null);

	// const { autoAssignFunc, isLoading } = useAutoAssign({
	//   assignShiftData,
	//   shiftRequestData,
	//   setAssignShiftData,
	// });
	const { showToast } = useToast();

	// const checkFunc = (targetField: "absolute" | "priority") => {
	//   if (checkedFields.includes(targetField)) {
	//     const newCheckedFields = checkedFields.filter(
	//       (field) => field !== targetField
	//     );
	//     setCheckedFields(newCheckedFields);
	//   } else {
	//     const newCheckedFields = [...checkedFields, targetField];
	//     setCheckedFields(newCheckedFields);
	//   }
	// };
	const onCloseAutoAssignModal = () => {
		const modal = document.getElementById(
			"ai-assign-modal",
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

	const handleAiAssign = async () => {
		setSuccessAssign(false);
		let dateFilter:
			| { mode: "ALL" }
			| { mode: "RANGE"; from: string; to: string }
			| { mode: "SINGLE"; date: string };
		if (assignRange === "range" && rangeStart && rangeEnd) {
			dateFilter = {
				mode: "RANGE",
				from: formatDateLocal(rangeStart),
				to: formatDateLocal(rangeEnd),
			};
		} else if (assignRange === "single" && singleDate) {
			dateFilter = {
				mode: "SINGLE",
				date: formatDateLocal(singleDate),
			};
		} else {
			dateFilter = { mode: "ALL" };
		}
		if (!isInputValid()) return;

		const memberProfiles: MemberProfileType[] = members.map((member) => ({
			uid: member.user.id,
			displayName: member.user.name,
			pictureUrl: member.user.pictureUrl ?? undefined,
			jobRoles: member.user.jobRoles
				? member.user.jobRoles.map(
						(roleObj: { roleId: string; role: { id: string; name: string } }) =>
							roleObj.role.name,
					)
				: [],
		}));

		const body: AutoShiftAdjustRequest = {
			templateShift: shiftRequestData,
			submissions: submittedShiftList,
			currentAssignments: assignShiftData.shifts,
			memberProfiles: memberProfiles,
			constraints: {
				dailyMaxPerUser: 1,
				allowPartialOverlap: false,
				maximizeDistinctAssignments: false,
				countScope: "WEEK",
				dateFilter: dateFilter,
			},
		};
		const res = await autoAdjust(body);
		if (!res.ok) {
			showToast(`AI調整に失敗しました。${"通信エラー"}`, "error");
			return;
		}
		startAutoAdjustMode(res.auto_modified);
		setSuccessAssign(true);
	};

	useEffect(() => {
		if (!isLoading && successAssign) {
			// モーダルを閉じる
			const modal = document.getElementById(
				"ai-assign-modal",
			) as HTMLDialogElement | null;
			modal?.close();
			// トースト表示
			showToast("AI調整が完了しました", "success");
			setSuccessAssign(false);
		}
	}, [isLoading, successAssign, showToast]);

	return (
		<>
			<dialog id={"ai-assign-modal"} className="modal modal-middle z-40">
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
					<h3 className="font-bold  text-green01 mb-1">シフト自動調整</h3>
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
									value="all"
									checked={assignRange === "all"}
									onChange={(e) =>
										setAssignRange(e.target.value as "all" | "range" | "single")
									}
									className="radio radio-sm radio-success"
									disabled={isLoading}
								/>
								<span className="text-sm text-gray-700">全体</span>
							</label>
							<label className="flex items-center gap-1">
								<input
									type="radio"
									value="range"
									checked={assignRange === "range"}
									onChange={(e) =>
										setAssignRange(e.target.value as "all" | "range" | "single")
									}
									className="radio radio-sm radio-success"
									disabled={isLoading}
								/>
								<span className="text-sm text-gray-700">特定期間</span>
							</label>
							<label className="flex items-center gap-1">
								<input
									type="radio"
									value="single"
									checked={assignRange === "single"}
									onChange={(e) =>
										setAssignRange(e.target.value as "all" | "range" | "single")
									}
									className="radio radio-sm radio-success"
									disabled={isLoading}
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
					<button
						type="button"
						className={`btn border-green01 text-green01 bg-white btn-block shadow-none bg-none ${
							!isInputValid() && "opacity-40"
						}`}
						onClick={() => handleAiAssign()}
						disabled={isLoading || !isInputValid()}
					>
						{isLoading ? (
							<span className="loading loading-dots" />
						) : (
							"自動調整を実行"
						)}
					</button>
				</div>
			</dialog>
		</>
	);
};

export default AIAssignModal;
