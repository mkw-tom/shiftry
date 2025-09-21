"use client";
import Link from "next/link";
import React from "react";
import { MdAdd } from "react-icons/md";

const AddShiftButton = () => {
	return (
		<Link
			href={"/dashboard/shift/create"}
			className="btn btn-sm bg-white text-green02 font-bold flex items-center gap-2 w-1/2 border-none rounded-md shadow-md" // onClick={() => darawerOpen(DrawerView.CREATE_REQUEST, null)}
		>
			<MdAdd className="text-green02 text-lg" />
			<span className="">シフトを追加</span>
		</Link>
	);
};

export default AddShiftButton;
