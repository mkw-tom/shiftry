import type { Member } from "@shared/api/common/types/prismaLite";
import React from "react";

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
	return (
		<React.Fragment>
			<div className="tabs tabs-sm tabs-box w-full mb-2 !bg-base">
				<button
					type="button"
					className={`tab w-1/3 flex items-center justify-center gap-2 px-0   !text-gray-700 ${
						tab === "staffPreference" ? "tab-active !bg-white" : ""
					}`}
					onClick={() => setTab("staffPreference")}
				>
					<span>基本希望</span>
				</button>
				<button
					type="button"
					className={`tab w-1/3 flex items-center justify-center gap-2 px-0   !text-gray-700 ${
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
					className={`tab w-1/3 flex items-center justify-center gap-2 px-0   !text-gray-700 ${
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
		</React.Fragment>
	);
};

export default SubmitStatusTubs;
