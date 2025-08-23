import type { RootState } from "@/app/redux/store";
import { useMembersHook } from "@/shared/api/get-members/hook";
import type { UserStoreLiteWithUserAndJobRoles } from "@shared/api/common/types/prismaLite";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import Member from "./Member";

const MembersList = ({
	membersFilter,
}: {
	membersFilter: "all" | "registed" | "notRegist";
}) => {
	const { members } = useSelector((state: RootState) => state.members);
	// const members: User[] = [
	// 	{
	// 		name: "佐藤 光",
	// 		id: "user-1",
	// 		createdAt: new Date("2025-06-01T10:00:00Z"),
	// 		updatedAt: new Date("2025-06-20T10:00:00Z"),
	// 		// lineId: "line-user-1",
	// 		lineId_hash: null,
	// 		lineId_enc: null,
	// 		lineKeyVersion_hash: "",
	// 		lineKeyVersion_enc: "",
	// 		consentAt: null,
	// 		pictureUrl: null,
	// 		// role: UserRole.OWNER,
	// 	},
	// 	{
	// 		name: "伊藤 優子",
	// 		id: "user-2",
	// 		createdAt: new Date("2025-06-03T11:15:00Z"),
	// 		updatedAt: new Date("2025-06-22T12:00:00Z"),
	// 		// lineId: "line-user-2",
	// 		lineId_hash: null,
	// 		lineId_enc: null,
	// 		lineKeyVersion_hash: "",
	// 		lineKeyVersion_enc: "",
	// 		consentAt: null,
	// 		pictureUrl: null,
	// 		// role: UserRole.STAFF,
	// 	},
	// 	{
	// 		name: "高橋 未来",
	// 		id: "user-3",
	// 		createdAt: new Date("2025-06-05T08:45:00Z"),
	// 		updatedAt: new Date("2025-06-23T09:30:00Z"),
	// 		// lineId: "line-user-3",
	// 		lineId_hash: null,
	// 		lineId_enc: null,
	// 		lineKeyVersion_hash: "",
	// 		lineKeyVersion_enc: "",
	// 		consentAt: null,
	// 		pictureUrl: null,
	// 		// role: UserRole.STAFF,
	// 	},
	// 	{
	// 		name: "中村 翼",
	// 		id: "user-4",
	// 		createdAt: new Date("2025-06-07T13:00:00Z"),
	// 		updatedAt: new Date("2025-06-24T14:00:00Z"),
	// 		// lineId: "line-user-4",
	// 		lineId_hash: null,
	// 		lineId_enc: null,
	// 		lineKeyVersion_hash: "",
	// 		lineKeyVersion_enc: "",
	// 		consentAt: null,
	// 		pictureUrl: null,
	// 		// role: UserRole.STAFF,
	// 	},
	// 	{
	// 		name: "山本 梨花",
	// 		id: "user-5",
	// 		createdAt: new Date("2025-06-10T09:00:00Z"),
	// 		updatedAt: new Date("2025-06-25T10:00:00Z"),
	// 		// lineId: "line-user-5",
	// 		lineId_hash: null,
	// 		lineId_enc: null,
	// 		lineKeyVersion_hash: "",
	// 		lineKeyVersion_enc: "",
	// 		consentAt: null,
	// 		pictureUrl: null,
	// 		// role: UserRole.STAFF,
	// 	},
	// ];

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
		<section className="w-full mx-auto h-[400px] overflow-hidden bg-white pt-1">
			<ul className="w-full h-[500px] mx-auto flex flex-col gap-1 overflow-y-scroll pt-2 pb-96">
				{members.map((member: UserStoreLiteWithUserAndJobRoles) => (
					<Member key={member.userId} member={member} />
				))}
			</ul>
		</section>
	);
};

export default MembersList;
