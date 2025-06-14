import { useMembersHook } from "@/app/features/common/api/get-members/hook";
import type { RootState } from "@/app/redux/store";
import type { User } from "@shared/common/types/prisma";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import Member from "./Member";

const MembersList = () => {
	const { members } = useSelector((state: RootState) => state.members);
	const trigger = members.length === 0;
	const { error, isLoading } = useMembersHook(trigger);

	if (isLoading) {
		return (
			<div className="text-center mt-10">
				<div className="loading loading-spinner loading-sm text-gray-400 mx-auto" />
				<p className="text-xs text-gray-500 mt-2">読み込み中...</p>
			</div>
		);
	}

	return (
		<section className="w-full max-h-[600px] mt-2 overflow-hidden">
			<ul className="w-11/12 h-auto mx-auto flex flex-col gap-0.5 overflow-y-scroll max-h-[580px] pb-96">
				{members.map((user: User) => (
					<Member key={user.id} user={user} />
				))}
			</ul>
		</section>
	);
};

export default MembersList;
