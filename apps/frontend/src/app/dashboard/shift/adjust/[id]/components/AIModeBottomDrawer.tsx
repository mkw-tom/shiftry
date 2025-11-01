import { useToast } from "@/app/dashboard/common/context/ToastProvider";
import { YMDW } from "@shared/utils/formatDate";
import React from "react";
import { BiCheck } from "react-icons/bi";
import { IoMdArrowDropleft, IoMdArrowDropright } from "react-icons/io";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import { RxUpdate } from "react-icons/rx";
import { useAdjustShiftForm } from "../context/AdjustShiftFormContextProvider.tsx";
import { useAiAdjustMode } from "../context/AiAdjustModeProvider";

const AIModeBottomDrawer = () => {
	const { assignShiftData, setAssignShiftData } = useAdjustShiftForm();
	const { showToast } = useToast();
	const { AiModified, setAiMode, validate, clearStates, allowModifiedDatas } =
		useAiAdjustMode();
	const modifiedKeys = Object.keys(AiModified);
	const [currentIdx, setCurrentIdx] = React.useState(0);
	const [collapsed, setCollapsed] = React.useState(true);
	const handlePrev = () => {
		setCurrentIdx((prev) => (prev > 0 ? prev - 1 : prev));
	};
	const handleNext = () => {
		setCurrentIdx((prev) => (prev < modifiedKeys.length - 1 ? prev + 1 : prev));
	};
	const currentKey = modifiedKeys[currentIdx];
	const currentValue = AiModified[currentKey];
	const handleCollapse = () => setCollapsed((prev) => !prev);

	const prevAssigned =
		assignShiftData.shifts[currentKey][
			currentValue ? Object.keys(currentValue)[0] : ""
		].assigned;

	const confrimAiAdjsut = () => {
		if (!validate) {
			alert("すべての変更点を許可または拒否してください。");
			return;
		}
		setAssignShiftData((prev) => {
			const newShifts = { ...prev.shifts };
			Object.entries(allowModifiedDatas).map(([date, times]) => {
				Object.entries(times).map(([timeRange, info]) => {
					newShifts[date][timeRange] = {
						...newShifts[date][timeRange],
						assigned: Array.isArray(info?.assigned)
							? info.assigned.map((staff) => ({
									...staff,
									confirmed: staff.confirmed ?? false,
									pictureUrl: staff.pictureUrl ?? undefined,
								}))
							: [],
						assignedCount: info?.assignedCount ?? 0,
						vacancies: info
							? info.count - info.assignedCount
							: newShifts[date][timeRange].vacancies,
					};
				});
			});
			return {
				...prev,
				shifts: newShifts,
			};
		});
		setAiMode(false);
		clearStates();
		showToast("AIの提案を適用しました。", "success");
	};

	const cancelAiAdjust = () => {
		setAiMode(false);
		clearStates();
	};

	return (
		<div className="fixed bottom-0 left-0 w-full flex flex-col bg-white/95 border-t-2 border-purple-500 z-50 ">
			<div className="flex items-center justify-center gap-2 bg-purple-50 px-3 pt-4 pb-3">
				<button
					type="button"
					className="text-purple-500 text-2xl mb-auto"
					onClick={handlePrev}
					disabled={currentIdx === 0}
				>
					<IoIosArrowBack />
				</button>
				<div className="flex-1 overflow-x-auto">
					{modifiedKeys.length > 0 ? (
						<div className="flex flex-col gap-2">
							<div className="text-sm text-gray-600 font-bold flex items-center gap-4 justify-between mx-3">
								<h3 className="flex items-center gap-4">
									<p>{YMDW(new Date(currentKey))} </p>
									<p className="text-purple-500 flex items-center gap-1">
										<RxUpdate className="text-xs" />
										<span>
											{currentIdx + 1}/{modifiedKeys.length}
										</span>
									</p>
								</h3>
								<button
									type="button"
									className={`btn btn-xs ${
										collapsed ? "btn-outline" : "btn-ghost"
									} border-gray-300 text-gray-500 w-fit`}
									onClick={handleCollapse}
								>
									{collapsed ? "詳細を表示" : "詳細を隠す"}
								</button>
							</div>
							{!collapsed &&
								currentValue &&
								Object.entries(currentValue).map(([timeRange, info]) => (
									<div key={timeRange} className="flex flex-col gap-1">
										<div className="flex  items-center gap-3 ">
											{info?.assignedCount === info?.count ? (
												<span className="badge badge-sm bg-green-500 text-white border-none">
													充足
												</span>
											) : (
												<span className="badge badge-sm bg-red-500 text-white border-none">
													不足 {info?.assignedCount}/{info?.count}
												</span>
											)}
											<span className="text-sm text-gray-600 min-w-[90px]">
												{timeRange.split("-")[0]} ~ {timeRange.split("-")[1]}
											</span>
										</div>
										<div className="flex items-center gap-3 ml-2">
											<span className="text-xs text-gray-700 font-bold min-w-[60px]">
												{info?.name}
											</span>

											<div className="avatar-group -space-x-1">
												{Array.isArray(prevAssigned) &&
												prevAssigned.length > 0 ? (
													prevAssigned.map((staff) => (
														<div className="avatar border-none" key={staff.uid}>
															<div className="w-5">
																<img
																	src={staff.pictureUrl || ""}
																	alt={staff.displayName}
																/>
															</div>
														</div>
													))
												) : (
													<span className="text-xs text-gray-400">未割当</span>
												)}
											</div>

											<MdKeyboardDoubleArrowRight className="text-purple-500" />

											<div className="avatar-group -space-x-1">
												{Array.isArray(info?.assigned) &&
												info.assigned.length > 0 ? (
													info?.assigned.map((staff) => (
														<div
															className="avatar border-1 border-purple-400"
															key={staff.uid}
														>
															<div className="w-5">
																<img
																	src={staff.pictureUrl || ""}
																	alt={staff.displayName}
																/>
															</div>
														</div>
													))
												) : (
													<span className="text-xs text-gray-400">未割当</span>
												)}
											</div>
										</div>
									</div>
								))}
						</div>
					) : (
						<span className="text-xs text-gray-400">変更はありません</span>
					)}
				</div>

				<button
					type="button"
					className="text-purple-500 text-2xl mb-auto"
					onClick={handleNext}
					disabled={
						currentIdx === modifiedKeys.length - 1 || modifiedKeys.length === 0
					}
				>
					<IoIosArrowForward />
				</button>
			</div>
			<div className="flex justify-end gap-2 items-center w-full py-3 border-t pb-6 px-3">
				<button type="button" className="btn-sm btn btn-link text-purple-500 ">
					AIの提案
				</button>
				<button
					type="button"
					className="btn btn-sm bg-purple-500 text-white border-none flex-1 shadow-sm"
					onClick={confrimAiAdjsut}
				>
					調整を適用
				</button>
				<button
					type="button"
					className="btn btn-sm border-gray02 bg-white text-gray02 w-1/5 shadow-sm"
					onClick={cancelAiAdjust}
				>
					中止
				</button>
			</div>
		</div>
	);
};

export default AIModeBottomDrawer;
