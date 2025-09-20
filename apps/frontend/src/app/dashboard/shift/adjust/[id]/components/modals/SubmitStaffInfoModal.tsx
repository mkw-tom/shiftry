// import { dummyMembers } from "@/app/utils/dummyData/member";
import { formatTimeRangeHHmm } from "@/app/utils/times";
import type { RootState } from "@/redux/store.js";
import { YMDHM, YMDW } from "@shared/utils/formatDate";
import React from "react";
import { BiCircle } from "react-icons/bi";
import { FcCancel } from "react-icons/fc";
import { IoTimeOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import { useAdjustShiftForm } from "../../context/AdjustShiftFormContextProvider.tsx";

const SubmitStaffInfoModal = ({
	open,
	onClose,
	userId,
}: {
	open: boolean;
	onClose: () => void;
	userId: string | null;
}) => {
	if (!open || !userId) return null;
	const { submittedShiftList } = useAdjustShiftForm();
	const submitData = submittedShiftList.find((s) => s.userId === userId);
	const { members } = useSelector((state: RootState) => state.members);
	const member = members.find((m) => m.user.id === userId);
	if (!submitData || !member) return null;
	return (
		<dialog open className="modal modal-middle">
			<div className="modal-box max-w-xs bg-white">
				<button
					type="button"
					className="btn btn-sm btn-circle absolute right-2 top-2 bg-white text-gray02 border border-gray02 shadow-none"
					onClick={onClose}
				>
					✕
				</button>
				<div className="flex items-center gap-3 mb-2">
					<div className="avatar">
						<div className="w-8 rounded-full">
							<img
								src={member.user.pictureUrl || ""}
								alt={member.user.name || "User Avatar"}
							/>
						</div>
					</div>
					<span className="text-gray-700 font-bold">{member.user.name}</span>
				</div>

				<div className="w-full flex items-center justify-between my-1">
					<div className="mb-2 text-xs text-gray-500">
						提出日: {YMDHM(submitData.createdAt)}
					</div>
					<div className="mb-2 text-xs text-gray-500 flex items-center gap-2">
						{submitData.status === "ADJUSTMENT" ? (
							<span className="flex items-center gap-1 mr-2">
								<span className="w-3 h-3 bg-warning rounded-full inline-block" />
								<span className="text-xs text-gray-600">調整中</span>
							</span>
						) : submitData.status === "CONFIRMED" ? (
							<span className="flex items-center gap-1 mr-2">
								<span className="w-3 h-3 bg-green-500 rounded-full inline-block" />
								<span className="text-xs text-gray-600">提出済</span>
							</span>
						) : (
							<span className="text-xs text-gray-600">{submitData.status}</span>
						)}
					</div>
				</div>

				<div className="mb-3 max-h-20">
					<div className="flex items-center mb-1">
						<span className="text-xs text-gray-700 font-bold">メモ</span>
					</div>
					<div className="px-2 text-sm text-gray-500 overflow-y-auto max-h-16">
						{submitData.memo || "なし"}
					</div>
				</div>
				<div className="mb-2 text-xs text-gray-700 font-bold">希望シフト</div>
				<div className="max-h-60 overflow-y-auto">
					{Object.entries(submitData.shifts).map(([date, value]) => (
						<div
							key={date}
							className="flex flex-col gap-1 mb-3 px-1 py-2 border-b border-gray-300 bg-transparent"
						>
							<div className="flex gap-2 items-center">
								<span className="text-gray-400 min-w-[90px] text-sm">
									{YMDW(new Date(date))}:
								</span>
								{value === "anytime" ? (
									<p className="text-sm text-green01 flex items-center gap-1">
										<BiCircle />
										<span>終日</span>
									</p>
								) : value === null ? (
									<p className="text-error text-sm flex items-center gap-1">
										<FcCancel />
										<span>休み</span>
									</p>
								) : (
									<span className="text-green01 text-sm flex items-center gap-1">
										<IoTimeOutline />
										<span>{formatTimeRangeHHmm(String(value))}</span>
									</span>
								)}
							</div>
						</div>
					))}
				</div>
			</div>
		</dialog>
	);
};

export default SubmitStaffInfoModal;
