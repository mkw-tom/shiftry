"use client";
import type { RootState } from "@/redux/store";
import type { UserRole } from "@shared/api/common/types/prisma";
import React from "react";
import { useSelector } from "react-redux";

const UserSection = () => {
	const { user } = useSelector((state: RootState) => state.user);

	function showUserRole(role: UserRole) {
		switch (role) {
			case "OWNER":
				return { text: "オーナー", color: "text-green01" };
			case "STAFF":
				return { text: "スタッフ", color: "text-blue01" };

			case "MANAGER":
				return { text: "マネージャー", color: "text-orange-400" };

			default:
				return { text: "not role", color: "text-gray02" };
		}
	}
	return (
		<section className="ml-8">
			<div className="flex gap-5 items-center mb-6 mt-8">
				{/* <div className="w-14 h-14 bg-gray01 rounded-full" /> */}
				<img
					src={user?.pictureUrl || "/default_user_image.png"}
					alt="ユーザー画像"
					className="w-14 h-14 rounded-full"
				/>
				<div className="h-auto text-left">
					<h3
						className={` font-bold text-xs ${showUserRole(user?.role as UserRole).color}`}
					>
						{showUserRole(user?.role as UserRole).text}
					</h3>
					<p className="text-black font-bold mt-1">
						{user?.name ? user?.name : "user is not found"}
					</p>
				</div>
			</div>
		</section>
	);
};

export default UserSection;
