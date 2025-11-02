import type { RootState } from "@/redux/store";
import { useMembersHook } from "@/shared/api/get-members/hook";
import type {
	Member,
	UserStoreLiteWithUserAndJobRoles,
} from "@shared/api/common/types/prismaLite";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import MemberCard from "./MemberCard";

const MembersList = ({
	membersFilter,
}: {
	membersFilter: "all" | "registed" | "notRegist";
}) => {
	const { members } = useSelector((state: RootState) => state.members);
	const trigger = members.length === 0;
	const { error, isLoading } = useMembersHook(trigger);

	if (isLoading) {
		return (
			<div className="text-center mt-10">
				<div className="loading loading-spinner loading-sm text-green02 mx-auto" />
				<p className="text-xs text-green02 mt-2">読み込み中...</p>
			</div>
		);
	}

	return (
		<section className="w-full mx-auto h-[400px] overflow-hidden bg-white">
			<ul className="w-full h-[600px] mx-auto flex flex-col gap-1 overflow-y-scroll pb-50">
				{members.map((member: Member) => (
					<MemberCard key={member.user.id} member={member} />
				))}
			</ul>
		</section>
	);
};

export default MembersList;
