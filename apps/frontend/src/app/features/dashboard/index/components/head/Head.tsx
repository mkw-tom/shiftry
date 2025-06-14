import React from "react";
import { useBottomDrawer } from "../../../common/context/useBottomDrawer";
import AddShiftButton from "./AddShiftButton";

const Head = () => {
	return (
		<div className="w-full h-auto">
			<div className="w-11/12 mx-auto flex justify-between items-center">
				<h2 className="text-sm font-bold pl-2 text-black">店舗AAA</h2>
				<AddShiftButton />
			</div>
		</div>
	);
};

export default Head;
