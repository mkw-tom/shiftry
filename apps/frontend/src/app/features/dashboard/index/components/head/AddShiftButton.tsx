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
			className="btn btn-sm bg-white text-green02 font-bold flex items-center gap-2 w-full border-none rounded-md shadow-md"
			onClick={() => darawerOpen(DrawerView.CREATE_REQUEST, null)}
		>
			<MdAdd className="text-green02 text-lg" />
			<span className="">シフトを追加</span>
		</button>
	);
};

export default AddShiftButton;
