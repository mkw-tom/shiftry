import {
	type UpsertShiftPositionType,
	WeekDays,
	bulkUpsertShiftPositionType,
} from "@shared/api/shiftPosition/validations/put-bulk";
import { translateWeekToJapanese } from "@shared/utils/formatWeek";
import React, { use, useState } from "react";
import { LuUserRound } from "react-icons/lu";
import { MdAdd } from "react-icons/md";
import { useCreateRequest } from "../context/useCreateRequest";
import PriorityAndAbsoluteModal from "./PriorityAndAbsoluteModal";
import UpsertPositionModal from "./UpsertPositionModal";

const RegistPositionForm = () => {
	// const [shiftPositioins, setShiftPositions] =
	//   useState<bulkUpsertShiftPositionType>(dummyShiftPositions);
	const { shiftPositioins, setShiftPositions } = useCreateRequest();
	const [position, setPosition] = useState<UpsertShiftPositionType>({
		name: "",
		startTime: "",
		endTime: "",
		jobRoles: [],
		count: 1,
		weeks: [],
		absolute: [],
		priority: [],
	});
	const [editIndex, setEditIndex] = useState<number | null>(null);

	const openUpsertPositionModal = (
		position: UpsertShiftPositionType,
		index: number | null,
	) => {
		setEditIndex(index);
		const modal = document.getElementById(
			`position_${position.name}`,
		) as HTMLDialogElement;
		if (modal) {
			modal.showModal();
		}
		setPosition(position);
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

	const handleSavePosition = (position: UpsertShiftPositionType) => {
		if (
			shiftPositioins.map((p) => p.name).includes(position.name) &&
			editIndex === null
		) {
			alert(
				"同じ名前のポジションが既に存在します。別の名前を入力してください。",
			);
			return;
		}
		setShiftPositions((prev) => {
			if (editIndex !== null) {
				const updated = [...prev];
				updated[editIndex] = position;
				return updated;
			}
			return [...prev, position];
		});

		// 初期化処理
		setPosition({
			name: "",
			startTime: "",
			endTime: "",
			jobRoles: [],
			count: 1,
			weeks: [],
			absolute: [],
			priority: [],
		});
		setEditIndex(null);
		console.log(shiftPositioins);
	};

	const DeletePosition = (index: number) => {
		if (!confirm("本当に削除しますか？")) {
			return;
		}
		setShiftPositions((prev) => prev.filter((_, i) => i !== index));
	};

	const closeUpsertPositionModal = () => {
		setPosition({
			name: "",
			startTime: "",
			endTime: "",
			jobRoles: [],
			count: 1,
			weeks: [],
			absolute: [],
			priority: [],
		});
		setEditIndex(null);
		const modal = document.getElementById(
			`position_${position.name}`,
		) as HTMLDialogElement;
		if (modal) {
			modal.close();
		}
	};

	return (
		<div className="w-full mx-auto flex flex-col h-auto">
			<UpsertPositionModal
				position={position}
				setPosition={setPosition}
				handleSavePosition={handleSavePosition}
				closeModal={closeUpsertPositionModal}
				editIndex={editIndex}
			/>

			<div className="w-full flex flex-col gap-1 items-center justify-center p-1 bg-white">
				<button
					type="button"
					className="btn btn-sm bg-white text-green01 font-bold w-full border-dashed border-1 border-gray01 shadow-none"
					onClick={() => openUpsertPositionModal(position, null)}
				>
					<MdAdd className="text-lg" />
					ポジションを追加
				</button>
			</div>
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
										onClick={() =>
											openUpsertPositionModal(targetPosition, index)
										}
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
										{new Date(targetPosition.startTime).toLocaleTimeString([], {
											hour: "2-digit",
											minute: "2-digit",
											hour12: false,
										})}{" "}
										~{" "}
										{new Date(targetPosition.endTime).toLocaleTimeString([], {
											hour: "2-digit",
											minute: "2-digit",
											hour12: false,
										})}
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
								{targetPosition.absolute.length > 0 && (
									<div
										className="h-auto flex gap-2 items-center justify-center"
										onClick={() =>
											openPriorytyAndAbsoluteModal(
												targetPosition.name,
												"absolute",
											)
										}
										onKeyDown={(e) => {
											if (e.key === "Enter" || e.key === " ") {
												openPriorytyAndAbsoluteModal(
													targetPosition.name,
													"absolute",
												);
											}
										}}
									>
										<p className="text-black">固定</p>
										<div className="avatar-group -space-x-1">
											{targetPosition.absolute.map((staff) => (
												<div className="avatar" key={staff.id}>
													<div className="w-4">
														<img src={staff.pictureUrl} alt={staff.name} />
													</div>
												</div>
											))}
										</div>
									</div>
								)}
								{targetPosition.priority.length > 0 && (
									<div
										className="h-auto flex gap-2  items-center justify-center px-1"
										onClick={() =>
											openPriorytyAndAbsoluteModal(
												targetPosition.name,
												"priority",
											)
										}
										onKeyDown={(e) => {
											if (e.key === "Enter" || e.key === " ") {
												openPriorytyAndAbsoluteModal(
													targetPosition.name,
													"priority",
												);
											}
										}}
									>
										<p className="text-black">優先</p>
										<div className="avatar-group -space-x-2">
											{targetPosition.priority.map((staff) => (
												<div className="avatar" key={staff.id}>
													<div className="w-4">
														<img src={staff.pictureUrl} alt={staff.name} />
													</div>
												</div>
											))}
										</div>
									</div>
								)}
							</div>
						</li>
					);
				})}
			</ul>
		</div>
	);
};

export default RegistPositionForm;
