import { formatHHmm } from "@/app/utils/times";
import type { UpsertShiftPositionBaseInput } from "@shared/api/shiftPosition/validations/put-bulk";
import { translateWeekToJapanese } from "@shared/utils/formatWeek";
import React, { useState } from "react";
import { LuUserRound } from "react-icons/lu";
import { useCreateRequest } from "../../context/CreateRequestFormProvider";
import PriorityAndAbsoluteModal from "../shared/PriorityAndAbsoluteModal";

const Positionlist = ({
	openUpsertPositionModal,
}: {
	openUpsertPositionModal: (
		position: UpsertShiftPositionBaseInput,
		index: number | null,
	) => void;
}) => {
	const { shiftPositioins, setShiftPositions } = useCreateRequest();
	const DeletePosition = (index: number) => {
		if (!confirm("本当に削除しますか？")) {
			return;
		}
		setShiftPositions((prev) => prev.filter((_, i) => i !== index));
	};

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

	return (
		<ul className="w-full h-[420px] overflow-y-auto flex flex-col pb-44">
			{shiftPositioins.map((targetPosition, index) => {
				return (
					<li
						key={targetPosition.name}
						className="text-gray01 text-sm flex flex-col items-start gap-1 border-b border-gray01 py-3 px-2 bg-white shadow-xs "
					>
						<div className="flex items-center justify-between w-full ">
							<span className="text-gray02  font-bold pl-2 border-l-4 border-gray02 w-2/3">
								{targetPosition.name}
							</span>
							<div className="flex items-center">
								<button
									type="button"
									className="btn btn-sm w-12 btn-link  text-green01 border-none"
									onClick={() => openUpsertPositionModal(targetPosition, index)}
								>
									編集
								</button>
								<button
									type="button"
									className="btn  btn-sm w-12 btn-link  text-gray02 border-none"
									onClick={() => DeletePosition(index)}
								>
									削除
								</button>
							</div>
						</div>

						<div className="w-full h-auto flex items-center justify-between mt-1 px-1">
							<div className="w-1/2 flex items-center gap-3">
								<p className="flex items-center">
									<LuUserRound className="text-black mr-1" />
									<span className="text-black">{targetPosition.count}</span>
								</p>
								<span className="text-black">
									{formatHHmm(targetPosition.startTime)} ~{" "}
									{formatHHmm(targetPosition.endTime)}
								</span>
							</div>

							<p className="w-1/2 text-black flex justify-end gap-1 border-none">
								{targetPosition.weeks.map((week) => {
									return (
										<span
											key={week}
											className="badge badge-sm w-6 border-gray02 text-black bg-white pt-0.5"
										>
											{translateWeekToJapanese(week, "short")}
										</span>
									);
								})}
							</p>
						</div>

						<div className="flex flex-wrap w-full items-center gap-1 mt-2 px-1">
							{targetPosition.jobRoles.map((role) => (
								<span
									key={role}
									className="badge badge-sm text-white bg-gray02 border-none"
								>
									{role}
								</span>
							))}
						</div>

						<PriorityAndAbsoluteModal
							name={targetPosition.name}
							mode={mode}
							data={
								mode === "absolute"
									? targetPosition.absolute
									: targetPosition.priority
							}
						/>
						<div className="w-full h-auto flex  gap-4 items-center justify-end mt-2 pl-2">
							{/* 固定（absolute） */}
							{targetPosition.absolute &&
								targetPosition.absolute.length > 0 && (
									<button
										type="button"
										className="h-auto flex items-center gap-2 justify-center"
										onClick={() =>
											openPriorytyAndAbsoluteModal(
												targetPosition.name,
												"absolute",
											)
										}
									>
										<p className="text-black">固定</p>
										<div className="avatar-group -space-x-1">
											{targetPosition.absolute.map((staff) => (
												<div className="avatar border-none" key={staff.id}>
													<div className="w-5">
														<img src={staff.pictureUrl} alt={staff.name} />
													</div>
												</div>
											))}
										</div>
									</button>
								)}

							{/* 優先（priority） */}
							{targetPosition.priority &&
								targetPosition.priority.length > 0 && (
									<button
										type="button"
										className="h-auto flex items-center gap-2 justify-center px-1"
										onClick={() =>
											openPriorytyAndAbsoluteModal(
												targetPosition.name,
												"priority",
											)
										}
									>
										<p className="text-black">優先</p>
										<div className="avatar-group -space-x-2">
											{targetPosition.priority.map((staff) => (
												<div className="avatar border-none" key={staff.id}>
													<div className="w-5">
														<img src={staff.pictureUrl} alt={staff.name} />
													</div>
												</div>
											))}
										</div>
									</button>
								)}
						</div>
					</li>
				);
			})}
		</ul>
	);
};

export default Positionlist;
