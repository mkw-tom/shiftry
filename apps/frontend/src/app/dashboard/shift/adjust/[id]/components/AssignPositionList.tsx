import { formatTimeRangeHHmm } from "@/app/utils/times";
import type { RootState } from "@/redux/store.js";
import type {
	AssignPositionType,
	AssignPositionWithDateInput,
} from "@shared/api/shift/assign/validations/put.js";
import type { RequestPositionWithDateInput } from "@shared/api/shift/request/validations/put";
import type React from "react";
import { useState } from "react";
import { BiCheck } from "react-icons/bi";
import { LuUserRound } from "react-icons/lu";
import { LuUserRoundPlus } from "react-icons/lu";
import { PiOpenAiLogo } from "react-icons/pi";
import { useSelector } from "react-redux";
import { useAdjustShiftForm } from "../context/AdjustShiftFormContextProvider.tsx";
import AiSuggestionModal from "./AiModal/AiSuggestionModal";
import AssignStaffModal from "./modals/AssignStaffModal";
import EditAssignPositionModal from "./modals/EditAssignPositionModal";
import ShowAssignListModal from "./modals/ShowAssignListModal";

const AssignPositionList = ({
	selectDate,
	openEditAssignPositionModal,
	editAssignPosition,
	setEditAssignPosition,
}: {
	selectDate: Date;
	openEditAssignPositionModal: (
		position: RequestPositionWithDateInput,
		date: string,
		mode: "new" | "adjust",
	) => void;
	editAssignPosition: AssignPositionWithDateInput;
	setEditAssignPosition: React.Dispatch<
		React.SetStateAction<AssignPositionWithDateInput>
	>;
}) => {
	// const { formData, setFormData } = useCreateRequest();
	const { assignShiftData, setAssignShiftData, shiftRequestData } =
		useAdjustShiftForm();
	const [assignStaffData, setAssignStaffData] = useState<{
		name: string;
		count: number;
		assigned: AssignPositionType["assigned"];
	}>({
		name: "",
		count: 0,
		assigned: [],
	});
	const { user } = useSelector((state: RootState) => state.user);

	const openAssignStaffModal = (
		date: string,
		time: string,
		position: AssignPositionType,
	) => {
		setAssignStaffData({
			name: position.name,
			count: position.count,
			assigned: position.assigned,
		});
		setTimeout(() => {
			const modal = document.getElementById(
				`${date}-${time}-${position.name}-assign-staff`,
			) as HTMLDialogElement | null;
			if (modal) {
				modal.showModal();
			}
		}, 0);
	};

	const openShowAssignListModal = (
		date: string,
		time: string,
		position: AssignPositionType,
	) => {
		const modal = document.getElementById(
			`assign-list-${date}-${time}-${position.name}`,
		) as HTMLDialogElement | null;
		if (modal) {
			modal.showModal();
		}
	};

	const openAISuggestionModal = (
		date: string,
		time: string,
		position: AssignPositionType,
	) => {
		setAssignStaffData({
			name: position.name,
			count: position.count,
			assigned: position.assigned,
		});
		setTimeout(() => {
			const modal = document.getElementById(
				`${date}-${time}-${position.name}-ai-suggestion-modal`,
			) as HTMLDialogElement | null;
			if (modal) {
				modal.showModal();
			}
		}, 0);
	};

	const deleteCalenerPosition = (date: string, time: string) => {
		if (!assignShiftData.shifts) return;
		if (!window.confirm("本当に削除しますか？")) return;
		const updatedAssignShiftData = { ...assignShiftData.shifts };
		if (updatedAssignShiftData[date]?.[time]) {
			delete updatedAssignShiftData[date][time];
			setAssignShiftData((prev) => ({
				...prev,
				shifts: updatedAssignShiftData,
			}));
		}
	};

	return (
		<ul className="w-full h-96 overflow-y-auto flex flex-col gap-2 mt-1 pb-50">
			{assignShiftData.shifts &&
				Object.entries(assignShiftData.shifts)
					.filter(([date]) => {
						// 選択中の日付（selectDate）と一致する日付のみ表示
						return new Date(date).toDateString() === selectDate.toDateString();
					})
					.flatMap(([date, positionsByTime]) =>
						positionsByTime
							? Object.entries(positionsByTime).map(
									([time, position], index) => {
										const [startTime, endTime] = time.split("-");
										const targetPosition = {
											...position,
											startTime: startTime,
											endTime: endTime,
										};
										// アサイン人数判定
										const assignedCount =
											position.assignedCount ?? position.assigned?.length ?? 0;
										const requiredCount = position.count ?? 0;
										// vacancies（不足人数）を正しく計算
										// assignShiftDataのvacancies値があればそれを優先
										const vacancies =
											position.vacancies ?? requiredCount - assignedCount;
										const isFull = assignedCount >= requiredCount;
										return (
											<li
												key={`${date}-${time}`}
												className="text-gray01 text-sm flex flex-col items-start gap-1 border-b border-gray01 py-3 px-2"
											>
												<div className="flex items-center justify-between w-full">
													<h1 className="text-gray02 border-l-4 border-l-gray02 font-bold pl-2 w-2/3 flex items-center gap-2 py-1.5">
														{position.name}
														{/* バッジ表示: 緑=充足, 赤=不足 */}
														{isFull ? (
															<span className="badge badge-sm bg-green-500 text-white border-none">
																充足
															</span>
														) : (
															<span className="badge badge-sm bg-red-500 text-white border-none">
																不足 {assignedCount}/{requiredCount}
															</span>
														)}
													</h1>

													{shiftRequestData.status === "ADJUSTMENT" &&
														user?.role !== "STAFF" && (
															<div className="flex items-center">
																<button
																	type="button"
																	className="btn btn-sm w-12 btn-link text-green01 border-none"
																	onClick={() =>
																		openEditAssignPositionModal(
																			targetPosition,
																			date,
																			"adjust",
																		)
																	}
																>
																	編集
																</button>
																<button
																	type="button"
																	className="btn  btn-sm w-12 btn-link  text-gray02 border-none"
																	onClick={() =>
																		deleteCalenerPosition(date, time)
																	}
																>
																	削除
																</button>
																{editAssignPosition.name === position.name &&
																	`${editAssignPosition.startTime}-${editAssignPosition.endTime}` ===
																		time && (
																		<EditAssignPositionModal
																			time={time}
																			date={date}
																			editAssignPosition={editAssignPosition}
																			setEditAssignPosition={
																				setEditAssignPosition
																			}
																			mode="adjust"
																		/>
																	)}
															</div>
														)}
												</div>
												<div className="w-full flex items-start justify-between px-1">
													<div className="flex items-center ">
														<div className="flex items-center gap-3">
															<p className="flex items-center badge badge-sm bg-white text-gray-800 border-gray02">
																<LuUserRound className="text-black text-[14px]" />
																<span className="text-black font-bold">
																	{position.count}
																</span>
															</p>
															<p className="text-black font-bold">
																{formatTimeRangeHHmm(time)}
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

												<ShowAssignListModal
													date={date}
													time={time}
													position={position}
												/>
												<div className="w-full h-auto flex flex-col gap-4 mt-3">
													<div className="w-full flex items-center gap-3">
														<div
															className="h-auto flex gap-2 pl-1"
															onClick={() =>
																openShowAssignListModal(date, time, position)
															}
															onKeyDown={(e) => {
																if (e.key === "Enter" || e.key === " ") {
																	openShowAssignListModal(date, time, position);
																}
															}}
														>
															<p className="text-black ">出勤予定</p>
															<div className="avatar-group -space-x-1">
																{position.assigned.length === 0 && (
																	<p className="text-gray02">なし</p>
																)}
																{position.assigned.map((staff) => (
																	<div
																		className="avatar border-none"
																		key={staff.uid}
																	>
																		<div className="w-5">
																			<img
																				src={staff.pictureUrl}
																				alt={staff.displayName}
																			/>
																		</div>
																	</div>
																))}
															</div>
														</div>
													</div>

													<AssignStaffModal
														date={date}
														time={time}
														assignStaffData={assignStaffData}
													/>
													<AiSuggestionModal
														date={date}
														time={time}
														assignStaffData={assignStaffData}
													/>

													{shiftRequestData.status === "ADJUSTMENT" &&
														user?.role !== "STAFF" && (
															<div className="w-full flex items-center gap-1">
																<button
																	type="button"
																	className="btn btn-sm w-2/3 border-green01 text-green01 font-bold bg-white shadow-none"
																	onClick={() =>
																		openAssignStaffModal(date, time, position)
																	}
																>
																	<LuUserRoundPlus className="text-[14px]" />
																	調整
																</button>
																<button
																	type="button"
																	className="btn btn-sm w-1/3 border-purple-500 text-purple-500 bg-white font-bold shadow-none"
																	onClick={() =>
																		openAISuggestionModal(date, time, position)
																	}
																>
																	<PiOpenAiLogo />
																	AI調整
																</button>
															</div>
														)}
												</div>
											</li>
										);
									},
								)
							: [],
					)}
		</ul>
	);
};

export default AssignPositionList;
