import { dummySubmittedShiftList } from "@/app/utils/dummyData/SubmittedShifts";
import type { RootState } from "@/redux/store.js";
// import { dummyMembers } from "@/app/utils/dummyData/member";
import { YMDW } from "@shared/utils/formatDate";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useAdjustShiftForm } from "../../context/AdjustShiftFormContextProvider.tsx";
import SubmitStaffInfoModal from "./SubmitStaffInfoModal";

const SubmitStatusModal = ({
	id = "submit-status",
	startDate,
	endDate,
}: {
	id: string;
	startDate: Date;
	endDate: Date;
}) => {
	// 提出済みuserId一覧
	const { submittedShiftList } = useAdjustShiftForm();

	const submittedIds = submittedShiftList.map((s) => s.userId);

	const { members } = useSelector((state: RootState) => state.members);

	const submittedMembers = members.filter((m) =>
		submittedIds.includes(m.user.id),
	);
	const notSubmittedMembers = members.filter(
		(m) => !submittedIds.includes(m.user.id),
	);

	const [tab, setTab] = useState<"submitted" | "notSubmitted">("submitted");
	// 詳細モーダルの状態
	const [infoUserId, setInfoUserId] = useState<string | null>(null);
	const onClose = () => {
		const modal = document.getElementById(id) as HTMLDialogElement | null;
		modal?.close();
	};
	return (
		<dialog id={id} className="modal modal-bottom">
			<div className="modal-box h-[500px] flex flex-col bg-white">
				<button
					type="button"
					className="flex w-full justify-center mb-5 -mt-3"
					onClick={onClose}
				>
					<div className="bg-gray02 w-1/4 rounded-full h-1.5" />
				</button>
				<h3 className="font-bold  text-gray-600 mb-1">シフト提出状況</h3>
				<h3 className="text-gray-600 text-sm mb-3 ml-1">
					{YMDW(startDate)} ~ {YMDW(endDate)}
				</h3>
				{/* タブ切り替え */}
				<div className="tabs tabs-sm tabs-box w-full mb-3 !bg-base">
					<button
						type="button"
						className={`tab w-1/2 flex items-center justify-center gap-2 px-0   !text-gray-700 ${
							tab === "submitted" ? "tab-active !bg-white" : ""
						}`}
						onClick={() => setTab("submitted")}
					>
						<span className="">提出</span>
						<span className="badge badge-xs badge-circle bg-green-500 text-white border-none">
							{submittedMembers.length}
						</span>
					</button>
					<button
						type="button"
						className={`tab w-1/2 flex items-center justify-center gap-2 px-0   !text-gray-700 ${
							tab === "notSubmitted" ? "tab-active !bg-white" : ""
						}`}
						onClick={() => setTab("notSubmitted")}
					>
						<span>未提出</span>
						<span className="badge badge-xs badge-circle bg-red-500 text-white border-none">
							{notSubmittedMembers.length}
						</span>
					</button>
				</div>
				{/* スクロール制限付きリスト */}
				<div className="py-2 px-2 flex-1 overflow-y-auto">
					{tab === "submitted" ? (
						submittedMembers.length === 0 ? (
							<div className="text-gray-400 mb-2">該当者なし</div>
						) : (
							submittedMembers.map((user) => {
								// dummySubmittedShiftListからstatusを取得
								const submitData = dummySubmittedShiftList.find(
									(s) => s.userId === user.user.id,
								);
								let badge = null;
								if (submitData?.status === "ADJUSTMENT") {
									badge = (
										<p className="flex items-center gap-1 mr-2">
											<span className="w-3 h-3 bg-warning rounded-full" />
											<span className="text-xs text-gray-600">調整中</span>
										</p>
									);
								} else if (submitData?.status === "CONFIRMED") {
									badge = (
										<p className="flex items-center gap-1 mr-2">
											<span className="w-3 h-3 bg-green-500 rounded-full" />
											<span className="text-xs text-gray-600">提出済</span>
										</p>
									);
								}
								return (
									<div
										key={user.user.id}
										className="flex items-center gap-3 mb-4"
									>
										<div className="avatar">
											<div className="w-8 rounded-full">
												<img
													src={user.user.pictureUrl || ""}
													alt={user.user.name || "User Avatar"}
												/>
											</div>
										</div>
										<span className="text-gray-700 flex-1">
											{user.user.name}
										</span>
										{badge}
										<SubmitStaffInfoModal
											open={!!infoUserId}
											onClose={() => setInfoUserId(null)}
											userId={infoUserId}
											// members={members}
											// submittedList={dummySubmittedShiftList}
										/>
										<button
											type="button"
											className="btn btn-xs ml-auto bg-base text-gray-700 border-gray01 shadow-none"
											onClick={() => setInfoUserId(user.user.id)}
										>
											開く
										</button>
									</div>
								);
							})
						)
					) : notSubmittedMembers.length === 0 ? (
						<div className="text-gray-400">該当者なし</div>
					) : (
						notSubmittedMembers.map((user) => (
							<div key={user.user.id} className="flex items-center gap-3 mb-4">
								<div className="avatar">
									<div className="w-8 rounded-full">
										<img
											src={user.user.pictureUrl || ""}
											alt={user.user.name || "User Avatar"}
										/>
									</div>
								</div>
								<span className="text-gray-700">{user.user.name}</span>
							</div>
						))
					)}
				</div>
			</div>
		</dialog>
	);
};

export default SubmitStatusModal;
