"use client";
import type { RootState } from "@/app/redux/store";
import type { UserRole } from "@shared/api/common/types/prisma";
import React from "react";
import { LuArrowUpDown } from "react-icons/lu";
import { useSelector } from "react-redux";

const Head = () => {
	const { user } = useSelector((state: RootState) => state.user);
	const { store } = useSelector((state: RootState) => state.store);
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
		<div className="w-full h-auto mx-auto">
			<div className="w-full mx-auto h-auto flex flex-col gap-3">
				<div className="flex items-center justify-between gap-3 bg-white px-5 pt-5 pb-3">
					<h2 className="text-green02 tracking-wide font-bold text-sm">
						{store?.name || "店舗名未設定"}
					</h2>
					<button type="button" className="flex items-center gap-1">
						<span className="text-xs text-green02 w-20">店舗切り替え</span>
						<LuArrowUpDown className="text-lg text-green02 opacity-90" />
						{/* <CiSettings className="text-xl text-white" /> */}
						{/* <AddShiftButton /> */}
					</button>
				</div>
			</div>
		</div>
	);
};

export default Head;
