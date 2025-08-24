import {
	type UpsertShiftPositionType,
	WeekDays,
	bulkUpsertShiftPositionType,
} from "@shared/api/shiftPosition/validations/put-bulk";
import { translateWeekToJapanese } from "@shared/utils/formatWeek";
import React, { use, useState } from "react";
import { LuUserRound } from "react-icons/lu";
import { MdAdd } from "react-icons/md";
import { useCreateRequest } from "../../../context/useCreateRequest";
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
		<div className="w-full flex flex-col  gap-2 h-auto">
			<UpsertPositionModal
				position={position}
				setPosition={setPosition}
				handleSavePosition={handleSavePosition}
				closeModal={closeUpsertPositionModal}
				editIndex={editIndex}
			/>

			<button
				type="button"
				className="btn bg-green01 text-white border-none w-full mt-2"
				onClick={() => openUpsertPositionModal(position, null)}
			>
				<MdAdd className="text-lg" />
				ポジションを追加
			</button>
			<ul className="w-full h-96 overflow-y-auto flex flex-col gap-2 5">
				{shiftPositioins.map((targetPosition, index) => {
					return (
						<li
							key={targetPosition.name}
							className="text-gray01 text-sm flex flex-col items-start gap-1 border-b border-gray01 py-3 px-1"
						>
							<div className="flex items-center justify-between w-full">
								<span className=" text-gray02 border-l-4  border-l-gray02 font-bold pl-2">
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
							<div className="flex items-start justify-between w-full px-1">
								<div className="flex items-center gap-3">
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
								<p className="text-black flex flex-wrap items-center gap-1 w-36 border-none">
									{targetPosition.weeks.map((week) => {
										return (
											<span
												key={week}
												className="badge badge-sm border-gray02 text-black bg-white pt-0.5"
											>
												{translateWeekToJapanese(week, "short")}
											</span>
										);
									})}
								</p>
							</div>
							<div className="flex items-center gap-1 px-1 mt-1">
								{targetPosition.jobRoles.map((role) => (
									<span
										key={role}
										className="badge text-white bg-gray02 border-none"
									>
										{role}
									</span>
								))}
							</div>
						</li>
					);
				})}
			</ul>
		</div>
	);
};

export default RegistPositionForm;
