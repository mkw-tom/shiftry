import Link from "next/link";
import React from "react";
import { BsArrowRight } from "react-icons/bs";
import { LuUsersRound } from "react-icons/lu";

const MemberListSection = () => {
	return (
		<section>
			<div className="collapse-title text-black font-bold text-xs text-left flex items-center">
				<LuUsersRound className="text-lg" />
				<span className="ml-2">スタッフ一覧</span>
				<Link
					href={"/dashboard/members"}
					className="flex gap-1 items-center ml-auto border-b-1 border-green02 text-green02"
				>
					<span>移動する</span>
					<BsArrowRight />
				</Link>
			</div>
		</section>
	);
};

export default MemberListSection;
