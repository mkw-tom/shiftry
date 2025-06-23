import React from "react";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import { LuUsersRound } from "react-icons/lu";
import { useBottomDrawer } from "../../../common/context/useBottomDrawer";
import AddShiftButton from "./AddShiftButton";

const Head = () => {
	return (
		<div className="w-full h-auto">
			<div className="w-11/12 mx-auto h-auto flex justify-between bg-white rounded-md px-3 py-4 shadow-md">
				<div className="flex flex-col gap-1">
					<h2 className="font-bold pl-2 text-black">店舗AAA</h2>
					<p className="flex  items-center text-gray02 pl-2 ">
						<LuUsersRound className="mr-2 text-lg" />
						<span className="mr-3">従業員：14名</span>
						<FaArrowUpRightFromSquare className="ctext-gray02" />
					</p>
				</div>
				<div className="flex flex-col gap-2">
					<AddShiftButton />
				</div>
			</div>
		</div>
	);
};

export default Head;
