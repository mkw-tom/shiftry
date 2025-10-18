import { formatTimeRangeHHmm } from "@/app/utils/times";
import {
	type AssignPositionType,
	AssignPositionWithDateInput,
} from "@shared/api/shift/assign/validations/put";
import { YMDW } from "@shared/utils/formatDate";
import React from "react";
import { LuUserRound } from "react-icons/lu";
import {
	MdKeyboardDoubleArrowDown,
	MdKeyboardDoubleArrowRight,
} from "react-icons/md";
import { useAiAdjustMode } from "../../context/AiAdjustModeProvider";

const ShowAssignListModal = ({
	date,
	time,
	position,
}: {
	date: string;
	time: string;
	position: AssignPositionType;
}) => {
	const { name, assigned, count, vacancies } = position;
	const { aiMode, AiModified, allowModifiedDatas, rejectModifiedDatas } =
		useAiAdjustMode();
	const onCloseAssignListModal = () => {
		const modal = document.getElementById(
			`assign-list-${date}-${time}-${name}`,
		) as HTMLDialogElement | null;
		modal?.close();
	};
	const aiIsFull =
		aiMode && AiModified[date]?.[time]
			? AiModified[date][time].assignedCount >= AiModified[date][time].count
			: false;

	return (
		<dialog
			id={`assign-list-${date}-${time}-${name}`}
			className="modal modal-bottom"
		>
			<div className="modal-box bg-white">
				<button
					type="button"
					className="flex w-full justify-center mb-5 -mt-3"
					onClick={onCloseAssignListModal}
				>
					<div className="bg-gray02 w-1/4 rounded-full h-1.5" />
				</button>
				{/* 日付・時間・ポジション名を見やすく表示 */}

				<div className="mb-2 flex items-center gap-1 font-bold text-gray-600">
					<div className="">{YMDW(new Date(date))}</div>
					<span className=" text-sm">{formatTimeRangeHHmm(time)}</span>
				</div>
				<div className="mb-2 flex flex-col gap-1">
					<h2 className="font-bold text-gray02 mb-2 flex items-center gap-3">
						<span className="text-gray-600 font-bold ml-1">{name}</span>

						{vacancies === 0 ? (
							<span className="badge badge-sm bg-green-500 text-white border-none">
								充足
								<span>
									{assigned ? assigned.length : 0}/{count}
								</span>
							</span>
						) : (
							<span className="badge badge-sm bg-red-500 text-white border-none">
								不足
								<span>
									{assigned ? assigned.length : 0}/{count}
								</span>
							</span>
						)}

						{aiMode && AiModified[date]?.[time] && (
							<MdKeyboardDoubleArrowRight className="text-purple-500" />
						)}

						{aiMode &&
							AiModified[date]?.[time] &&
							(aiIsFull ? (
								<span className="badge badge-sm bg-green-500 text-white border-none">
									充足 {aiMode && AiModified[date]?.[time].assignedCount}/
									{aiMode && AiModified[date]?.[time].count}
								</span>
							) : (
								<span className="badge badge-sm bg-red-500 text-white border-none">
									不足 {aiMode && AiModified[date]?.[time].assignedCount}/
									{aiMode && AiModified[date]?.[time].count}
								</span>
							))}
					</h2>
				</div>

				<div className="py-2 px-1">
					{assigned?.length === 0 ? (
						<div className="text-gray-400">該当者なし</div>
					) : (
						assigned?.map((user) => (
							<div key={user.uid} className="flex items-center gap-3 mb-2">
								<div className="avatar">
									<div className="w-8 rounded-full">
										<img
											src={user.pictureUrl || ""}
											alt={user.displayName || "User Avatar"}
										/>
									</div>
								</div>
								<span className="text-gray-700">{user.displayName}</span>
								{user.source === "absolute" && (
									<span className="badge badge-sm badge-dash text-info text-xs ml-1">
										固定
									</span>
								)}
								{user.source === "priority" && (
									<span className="badge badge-sm badge-dash text-green01 text-xs ml-1">
										優先
									</span>
								)}
							</div>
						))
					)}
				</div>
				{aiMode && AiModified[date]?.[time] && (
					<>
						<MdKeyboardDoubleArrowDown className="text-purple-500/30 mx-auto text-2xl my-2" />
						<div className="border-1 border-purple-500 p-3 bg-purple-50 flex flex-col gap-2">
							{AiModified[date]?.[time]?.assigned.map((user) => (
								<div key={user.uid} className="flex items-center gap-3">
									<div className="avatar">
										<div className="w-8 rounded-full">
											<img
												src={user.pictureUrl || ""}
												alt={user.displayName || "User Avatar"}
											/>
										</div>
									</div>
									<span className="text-gray-700">{user.displayName}</span>
									{user.source === "absolute" && (
										<span className="badge badge-sm badge-dash text-info text-xs ml-1">
											固定
										</span>
									)}
									{user.source === "priority" && (
										<span className="badge badge-sm badge-dash text-green01 text-xs ml-1">
											優先
										</span>
									)}
								</div>
							))}
						</div>
					</>
				)}
			</div>
		</dialog>
	);
};

export default ShowAssignListModal;
