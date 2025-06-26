import type { RootState } from "@/app/redux/store";
import type { UserRole } from "@shared/common/types/prisma";
import React from "react";
import { CiSettings } from "react-icons/ci";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import { LuUsersRound } from "react-icons/lu";
import { LuArrowUpDown } from "react-icons/lu";
import { useSelector } from "react-redux";
import { useBottomDrawer } from "../../../common/context/useBottomDrawer";
import AddShiftButton from "./AddShiftButton";

const Head = () => {
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
		<div className="w-full h-auto mx-auto bg-white">
			<div className="w-full mx-auto h-auto flex flex-col gap-3">
				<div className="flex items-center justify-between gap-2 bg-green02 px-5 pt-5 pb-3">
					<h2 className="text-white tracking-wide font-bold">アイウエオ店舗</h2>
					<button type="button" className="flex items-center gap-1">
						<span className="text-sm text-white">店舗切り替え</span>
						<LuArrowUpDown className="text-lg text-white opacity-90" />
						{/* <CiSettings className="text-xl text-white" /> */}
						{/* <AddShiftButton /> */}
					</button>
				</div>

				{/* <div className="flex items-center text-gray02 px-7 gap-3 pb-5 pt-3 rounded-b-sm">
					<div className="bg-gray02 rounded-full w-8 h-8 " />
					<p className="mr-3 flex items-center gap-6">
						<span className="mr-3 text-black opacity-80">山田 太朗</span>
						<h3
							className={` font-bold text-xs ${
								showUserRole(user?.role as UserRole).color
							}`}
						>
							{showUserRole(user?.role as UserRole).text}
						</h3>
					</p>
				</div> */}
			</div>
		</div>
	);
};

export default Head;
