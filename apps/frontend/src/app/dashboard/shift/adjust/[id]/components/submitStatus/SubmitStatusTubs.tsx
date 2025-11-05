import type { RootState } from "@/redux/store";
import type { Member } from "@shared/api/common/types/prismaLite";
import React from "react";
import { useSelector } from "react-redux";

interface Props {
	tab: "submitted" | "notSubmitted" | "staffPreference";
	setTab: (tab: "submitted" | "notSubmitted" | "staffPreference") => void;
	submittedMembers: Member[];
	notSubmittedMembers: Member[];
}

const SubmitStatusTubs: React.FC<Props> = ({
	tab,
	setTab,
	submittedMembers,
	notSubmittedMembers,
}) => {
	const { members } = useSelector((state: RootState) => state.members);

	return (
		<React.Fragment>
			<div className="tabs tabs-sm tabs-box w-full mb-2 !bg-base">
				<button
					type="button"
					className={`tab w-1/3 flex items-center justify-center gap-2 px-0   !text-gray-700 ${
						tab === "staffPreference" ? "tab-active !bg-white" : "opacity-60"
					}`}
					onClick={() => setTab("staffPreference")}
				>
					<span>基本希望</span>
					<span className="h-4 w-4 rounded-full text-center flex items-center justify-center text-white text-xs bg-green02">
						{members.length}
					</span>
				</button>
				<button
					type="button"
					className={`tab w-1/3 flex items-center justify-center gap-2 px-0   !text-gray-700 ${
						tab === "submitted" ? "tab-active !bg-white" : "opacity-60"
					}`}
					onClick={() => setTab("submitted")}
				>
					<span className="">提出</span>
					<span className="h-4 w-4 rounded-full text-center flex items-center justify-center text-white text-xs bg-green01">
						{submittedMembers.length}
					</span>
				</button>
				<button
					type="button"
					className={`tab w-1/3 flex items-center justify-center gap-2 px-0   !text-gray-700 ${
						tab === "notSubmitted" ? "tab-active !bg-white" : "opacity-60"
					}`}
					onClick={() => setTab("notSubmitted")}
				>
					<span>未提出</span>
					<span className="h-4 w-4 rounded-full text-center flex items-center justify-center text-white text-xs bg-gray02">
						{notSubmittedMembers.length}
					</span>
				</button>
			</div>
		</React.Fragment>
	);
};

export default SubmitStatusTubs;
