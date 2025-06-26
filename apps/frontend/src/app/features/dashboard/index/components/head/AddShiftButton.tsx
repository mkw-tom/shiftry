"use client";
import React from "react";
import { MdAdd } from "react-icons/md";
import {
	DrawerView,
	useBottomDrawer,
} from "../../../common/context/useBottomDrawer";

const AddShiftButton = () => {
	const { darawerOpen } = useBottomDrawer();

	return (
		<button
			type="button"
			className="btn btn-sm bg-gray02 opacity-90 text-white font-bold flex items-center gap-2 w-full border-none rounded-sm"
			onClick={() => darawerOpen(DrawerView.CREATE_REQUEST, null)}
		>
			<MdAdd className="text-white text-lg" />
			<span className="">シフトを追加</span>
		</button>
	);
};

export default AddShiftButton;
