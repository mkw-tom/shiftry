import { formatTimeRangeHHmm } from "@/app/utils/times";
import type { RequestPositionWithDateInput } from "@shared/api/shift/request/validations/put";
import type React from "react";
import { useState } from "react";
import { LuUserRound } from "react-icons/lu";
import { useCreateRequest } from "../../context/CreateRequestFormProvider";
// import type { AdjustPositionFormType } from "../../hook/form/useAdjustPositoinForm";
import PriorityAndAbsoluteModal from "../shared/PriorityAndAbsoluteModal";
import AdjustPositionModal from "./AdjustModal";

const positionCard = ({
	selectDate,
	openAdjustCalenerPositionModal,
	editCalendarPositon,
	setEditCalendarPositon,
}: {
	selectDate: Date;
	openAdjustCalenerPositionModal: (
		position: RequestPositionWithDateInput,
		date: string,
	) => void;
	editCalendarPositon: RequestPositionWithDateInput;
	setEditCalendarPositon: React.Dispatch<
		React.SetStateAction<RequestPositionWithDateInput>
	>;
}) => {
	const { formData, setFormData } = useCreateRequest();

	const [mode, setMode] = useState<"priority" | "absolute">("priority");

	const openPriorytyAndAbsoluteModal = (
		name: string,
		mode: "priority" | "absolute",
	) => {
		setMode(mode);
		const modal = document.getElementById(
			`modal_${name}_${mode}`,
		) as HTMLDialogElement | null;
		if (modal) {
			modal.showModal();
		}
	};

	const deleteCalenerPosition = (date: string, time: string) => {
		if (!formData.requests) return;
		if (!window.confirm("本当に削除しますか？")) return;
		const updatedRequests = { ...formData.requests };
		if (updatedRequests[date]?.[time]) {
			delete updatedRequests[date][time];
			setFormData((prev) => ({
				...prev,
				requests: updatedRequests,
			}));
		}
	};

	return (
		<ul className="w-full h-96 overflow-y-auto flex flex-col gap-2 mt-1 pb-50">
			{formData.requests &&
				Object.entries(formData.requests)
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
										return (
											<li
												key={`${date}-${time}`}
												className="text-gray01 text-sm flex flex-col items-start gap-1 border-b border-gray01 py-3 px-2"
											>
												<div className="flex items-center justify-between w-full">
													<h1 className="text-gray02 border-l-4 border-l-gray02 font-bold pl-2 w-2/3">
														{position.name}
													</h1>

													<div className="flex items-center">
														<button
															type="button"
															className="btn btn-sm w-12 btn-link text-green01 border-none"
															onClick={() =>
																openAdjustCalenerPositionModal(
																	targetPosition,
																	date,
																	// time
																)
															}
														>
															編集
														</button>
														<button
															type="button"
															className="btn  btn-sm w-12 btn-link  text-gray02 border-none"
															onClick={() => deleteCalenerPosition(date, time)}
														>
															削除
														</button>
														<AdjustPositionModal
															time={time}
															date={date}
															editCalenderrPositon={editCalendarPositon}
															setEditCalendarPosition={setEditCalendarPositon}
															mode={"adjust"}
															// editTime={editTime}
															// setEditTime={setEditTime}
														/>
													</div>
												</div>
												<div className="w-full flex items-start justify-between px-1">
													<div className="flex items-center">
														<div className="flex items-center gap-3">
															<p className="flex items-center">
																<LuUserRound className="text-black mr-1" />
																<span className="text-black">
																	{position.count}
																</span>
															</p>
															<p className="text-black">
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

												<PriorityAndAbsoluteModal
													name={position.name}
													mode={mode}
													data={
														mode === "absolute"
															? position.absolute
															: position.priority
													}
												/>

												<div className="w-full h-auto flex  gap-4 items-center justify-end mt-3 pl-2">
													{position.absolute === undefined ||
														(position.absolute.length > 0 && (
															<div
																className="h-auto flex gap-2 items-center justify-center"
																onClick={() =>
																	openPriorytyAndAbsoluteModal(
																		position.name,
																		"absolute",
																	)
																}
																onKeyDown={(e) => {
																	if (e.key === "Enter" || e.key === " ") {
																		openPriorytyAndAbsoluteModal(
																			position.name,
																			"absolute",
																		);
																	}
																}}
															>
																<p className="text-black">固定</p>
																<div className="avatar-group -space-x-1">
																	{position.absolute.map((staff) => (
																		<div
																			className="avatar border-none"
																			key={staff.id}
																		>
																			<div className="w-5">
																				<img
																					src={staff.pictureUrl}
																					alt={staff.name}
																				/>
																			</div>
																		</div>
																	))}
																</div>
															</div>
														))}

													{position.priority === undefined ||
														(position.priority.length > 0 && (
															<div
																className="h-auto flex gap-2  items-center justify-center px-1"
																onClick={() =>
																	openPriorytyAndAbsoluteModal(
																		position.name,
																		"priority",
																	)
																}
																onKeyDown={(e) => {
																	if (e.key === "Enter" || e.key === " ") {
																		openPriorytyAndAbsoluteModal(
																			position.name,
																			"priority",
																		);
																	}
																}}
															>
																<p className="text-black">優先</p>
																<div className="avatar-group -space-x-1">
																	{position.priority.map((staff) => (
																		<div
																			className="avatar border-none"
																			key={staff.id}
																		>
																			<div className="w-5">
																				<img
																					src={staff.pictureUrl}
																					alt={staff.name}
																				/>
																			</div>
																		</div>
																	))}
																</div>
															</div>
														))}
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

export default positionCard;
