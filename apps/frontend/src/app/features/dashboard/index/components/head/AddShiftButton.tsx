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
			className="btn btn-sm w-24 bg-green02 text-white text-[11px] font-bold shadow-md flex items-center px-3 gap-1 border-none"
			onClick={() => darawerOpen(DrawerView.CREATE_REQUEST, null)}
		>
			<MdAdd className="text-white font-bold" />
			シフト追加
		</button>
	);
};

export default AddShiftButton;
