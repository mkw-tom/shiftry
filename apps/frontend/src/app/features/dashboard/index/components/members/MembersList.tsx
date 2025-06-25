import { useMembersHook } from "@/app/features/common/api/get-members/hook";
import type { RootState } from "@/app/redux/store";
import { type User, UserRole } from "@shared/common/types/prisma";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import Member from "./Member";

const MembersList = ({
	membersFilter,
}: {
	membersFilter: "all" | "registed" | "notRegist";
}) => {
	// const { members } = useSelector((state: RootState) => state.members);
	const members = [
		{
			name: "佐藤 光",
			id: "user-1",
			createdAt: new Date("2025-06-01T10:00:00Z"),
			updatedAt: new Date("2025-06-20T10:00:00Z"),
			lineId: "line-user-1",
			pictureUrl: null,
			role: UserRole.OWNER,
		},
		{
			name: "伊藤 優子",
			id: "user-2",
			createdAt: new Date("2025-06-03T11:15:00Z"),
			updatedAt: new Date("2025-06-22T12:00:00Z"),
			lineId: "line-user-2",
			pictureUrl: null,
			role: UserRole.STAFF,
		},
		{
			name: "高橋 未来",
			id: "user-3",
			createdAt: new Date("2025-06-05T08:45:00Z"),
			updatedAt: new Date("2025-06-23T09:30:00Z"),
			lineId: "line-user-3",
			pictureUrl: null,
			role: UserRole.STAFF,
		},
		{
			name: "中村 翼",
			id: "user-4",
			createdAt: new Date("2025-06-07T13:00:00Z"),
			updatedAt: new Date("2025-06-24T14:00:00Z"),
			lineId: "line-user-4",
			pictureUrl: null,
			role: UserRole.STAFF,
		},
		{
			name: "山本 梨花",
			id: "user-5",
			createdAt: new Date("2025-06-10T09:00:00Z"),
			updatedAt: new Date("2025-06-25T10:00:00Z"),
			lineId: "line-user-5",
			pictureUrl: null,
			role: UserRole.STAFF,
		},
		{
			name: "山本 梨花",
			id: "user-5",
			createdAt: new Date("2025-06-10T09:00:00Z"),
			updatedAt: new Date("2025-06-25T10:00:00Z"),
			lineId: "line-user-5",
			pictureUrl: null,
			role: UserRole.STAFF,
		},
		{
			name: "山本 梨花",
			id: "user-5",
			createdAt: new Date("2025-06-10T09:00:00Z"),
			updatedAt: new Date("2025-06-25T10:00:00Z"),
			lineId: "line-user-5",
			pictureUrl: null,
			role: UserRole.STAFF,
		},
		{
			name: "山本 梨花",
			id: "user-5",
			createdAt: new Date("2025-06-10T09:00:00Z"),
			updatedAt: new Date("2025-06-25T10:00:00Z"),
			lineId: "line-user-5",
			pictureUrl: null,
			role: UserRole.STAFF,
		},

		{
			name: "山本 梨花",
			id: "user-5",
			createdAt: new Date("2025-06-10T09:00:00Z"),
			updatedAt: new Date("2025-06-25T10:00:00Z"),
			lineId: "line-user-5",
			pictureUrl: null,
			role: UserRole.STAFF,
		},
		{
			name: "山本 梨花",
			id: "user-5",
			createdAt: new Date("2025-06-10T09:00:00Z"),
			updatedAt: new Date("2025-06-25T10:00:00Z"),
			lineId: "line-user-5",
			pictureUrl: null,
			role: UserRole.STAFF,
		},
		{
			name: "山本 梨花",
			id: "user-5",
			createdAt: new Date("2025-06-10T09:00:00Z"),
			updatedAt: new Date("2025-06-25T10:00:00Z"),
			lineId: "line-user-5",
			pictureUrl: null,
			role: UserRole.STAFF,
		},
		{
			name: "山本 梨花",
			id: "user-5",
			createdAt: new Date("2025-06-10T09:00:00Z"),
			updatedAt: new Date("2025-06-25T10:00:00Z"),
			lineId: "line-user-5",
			pictureUrl: null,
			role: UserRole.STAFF,
		},
		{
			name: "山本 梨花",
			id: "user-5",
			createdAt: new Date("2025-06-10T09:00:00Z"),
			updatedAt: new Date("2025-06-25T10:00:00Z"),
			lineId: "line-user-5",
			pictureUrl: null,
			role: UserRole.STAFF,
		},
		{
			name: "山本 梨花",
			id: "user-5",
			createdAt: new Date("2025-06-10T09:00:00Z"),
			updatedAt: new Date("2025-06-25T10:00:00Z"),
			lineId: "line-user-5",
			pictureUrl: null,
			role: UserRole.STAFF,
		},
		{
			name: "山本 梨花",
			id: "user-5",
			createdAt: new Date("2025-06-10T09:00:00Z"),
			updatedAt: new Date("2025-06-25T10:00:00Z"),
			lineId: "line-user-5",
			pictureUrl: null,
			role: UserRole.STAFF,
		},
		{
			name: "山本 梨花",
			id: "user-5",
			createdAt: new Date("2025-06-10T09:00:00Z"),
			updatedAt: new Date("2025-06-25T10:00:00Z"),
			lineId: "line-user-5",
			pictureUrl: null,
			role: UserRole.STAFF,
		},
		{
			name: "山本 梨花",
			id: "user-5",
			createdAt: new Date("2025-06-10T09:00:00Z"),
			updatedAt: new Date("2025-06-25T10:00:00Z"),
			lineId: "line-user-5",
			pictureUrl: null,
			role: UserRole.STAFF,
		},
		{
			name: "山本 梨花",
			id: "user-5",
			createdAt: new Date("2025-06-10T09:00:00Z"),
			updatedAt: new Date("2025-06-25T10:00:00Z"),
			lineId: "line-user-5",
			pictureUrl: null,
			role: UserRole.STAFF,
		},
		{
			name: "山本 梨花",
			id: "user-5",
			createdAt: new Date("2025-06-10T09:00:00Z"),
			updatedAt: new Date("2025-06-25T10:00:00Z"),
			lineId: "line-user-5",
			pictureUrl: null,
			role: UserRole.STAFF,
		},
		{
			name: "山本 梨花",
			id: "user-5",
			createdAt: new Date("2025-06-10T09:00:00Z"),
			updatedAt: new Date("2025-06-25T10:00:00Z"),
			lineId: "line-user-5",
			pictureUrl: null,
			role: UserRole.STAFF,
		},
	];

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
		<section className="w-full mx-auto h-[450px]  bg-white shadow-md rounded-b-sm">
			<ul className="w-full h-full p-2 flex flex-col gap-0.5 overflow-y-scroll">
				{members.map((user: User) => (
					<Member key={user.id} user={user} />
				))}
			</ul>
		</section>
	);
};

export default MembersList;
