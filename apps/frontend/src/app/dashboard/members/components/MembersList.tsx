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

	// const Dummymembers: Member[] = [
	//   {
	//     role: "OWNER", // or "STAFF" など
	//     user: {
	//       id: "u1",
	//       name: "山田太郎",
	//       pictureUrl: "https://example.com/yamada.png",
	//       jobRoles: [
	//         {
	//           roleId: "r1",
	//           role: {
	//             id: "r1",
	//             name: "レジ",
	//           },
	//         },
	//         {
	//           roleId: "r2",
	//           role: {
	//             id: "r2",
	//             name: "接客",
	//           },
	//         },
	//       ],
	//     },
	//   },
	//   {
	//     role: "STAFF",
	//     user: {
	//       id: "u2",
	//       name: "佐藤花子",
	//       pictureUrl: "https://example.com/sato.png",
	//       jobRoles: [
	//         {
	//           roleId: "r3",
	//           role: {
	//             id: "r3",
	//             name: "清掃",
	//           },
	//         },
	//       ],
	//     },
	//   },
	// ];

	if (isLoading) {
		return (
			<div className="text-center mt-10">
				<div className="loading loading-spinner loading-sm text-gray-400 mx-auto" />
				<p className="text-xs text-gray-500 mt-2">読み込み中...</p>
			</div>
		);
	}

	return (
		<section className="w-full mx-auto h-[400px] overflow-hidden bg-white pt-1">
			<ul className="w-full h-[500px] mx-auto flex flex-col gap-1 overflow-y-scroll pt-2 pb-96">
				{members.map((member: Member) => (
					<MemberCard key={member.user.id} member={member} />
				))}
			</ul>
		</section>
	);
};

export default MembersList;
