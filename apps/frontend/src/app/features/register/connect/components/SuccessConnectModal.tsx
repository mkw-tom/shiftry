"use client";
import { useNavigation } from "@/app/lib/navigation";
import React from "react";

const SuccessConnectModal = () => {
	const { navigateRegisterPayment } = useNavigation();

	return (
		<>
			<p className="text-center text-xs font-bold py-3">
				LINEグループ連携が完了しました✨
				<br />
			</p>
			<button
				type="button"
				className="btn btn-sm sm:btn-md bg-green02 rounded-full border-none w-2/3 mx-auto text-white"
				onClick={navigateRegisterPayment}
			>
				ご利用プランを選択
			</button>
		</>
	);
};

export default SuccessConnectModal;
