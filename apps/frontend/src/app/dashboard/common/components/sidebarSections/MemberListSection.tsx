import Link from "next/link";
import React from "react";
import { LuUsersRound } from "react-icons/lu";

const MemberListSection = () => {
	return (
		<section>
			<Link
				href={"/dashboard/members"}
				className="collapse-title text-black font-bold text-xs text-left flex items-center"
			>
				<LuUsersRound className="text-lg" />
				<span className="ml-2">スタッフ一覧</span>
			</Link>
		</section>
	);
};

export default MemberListSection;
