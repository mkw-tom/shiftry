import { MDW } from "@shared/utils/formatDate";
import React from "react";
import { DrawerView, useBottomDrawer } from "../../context/useBottomDrawer";

const DrawerHead = () => {
	const { view, currentData } = useBottomDrawer();

	function ChangeBtnTextByView(view: DrawerView | undefined) {
		switch (view) {
			case DrawerView.CREATE_REQUEST:
				return "スタッフに依頼";
			case DrawerView.SUBMIT:
				return "この内容で提出";
			case DrawerView.STATUS:
				return "提出状況を確認";
			case DrawerView.ADJUSTMENT:
				return "調整データを確定する";
			case DrawerView.CONFIRM:
				return "シフトを確定する";
			default:
				return "操作を選択";
		}
	}

	return (
		<div className="w-full h-auto flex flex-col items-center gap-1 mt-5">
			{view === DrawerView.CREATE_REQUEST && (
				<h2 className="text-green02 font-bold text-center border-b-1 border-b-gray01 w-full">
					{"シフト提出依頼の作成"}
				</h2>
			)}
			{view !== undefined && view !== DrawerView.CREATE_REQUEST && (
				<h2 className="text-black font-bold text-center border-b-1 border-b-gray01 w-full">
					{MDW(new Date(currentData?.weekStart as Date))} ~{" "}
					{MDW(new Date(currentData?.weekEnd as Date))}
				</h2>
			)}
			{/* <button
				type="button"
				className="w-full h-8 bg-green02 shadow-sm rounded-full font-bold text-sm text-white"
			>
				{ChangeBtnTextByView(view)}
			</button> */}
		</div>
	);
};

export default DrawerHead;
