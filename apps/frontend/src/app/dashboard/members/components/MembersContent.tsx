"use client";
import React, { useState } from "react";
import CreateStaffButton from "./CreateStaffButton";
import CreateStaffPreferenceModal from "./CreateStaffPreference";
import MemberHead from "./MemberHead";
import MembersList from "./MembersList";

const MembersContent = () => {
	const [membersFilter, setMembersFilter] = useState<
		"all" | "registed" | "notRegist"
	>("all");

	const openStaffPreferenceModal = () => {
		const modal = document.getElementById(
			"staff-preference-modal-create",
		) as HTMLDialogElement | null;
		modal?.showModal();
	};

	const onCloseStaffPreferenceModal = () => {
		const modal = document.getElementById(
			"staff-preference-modal-create",
		) as HTMLDialogElement | null;
		modal?.close();
	};

	return (
		<div className="w-full h-full">
			<CreateStaffPreferenceModal onClose={onCloseStaffPreferenceModal} />
			<MemberHead
				membersFilter={membersFilter}
				setMembersFilter={setMembersFilter}
			/>

			<div className="w-full h-auto mx-auto">
				<CreateStaffButton
					openStaffPreferenceModal={openStaffPreferenceModal}
				/>
				<MembersList membersFilter={membersFilter} />
			</div>
		</div>
	);
};

export default MembersContent;
