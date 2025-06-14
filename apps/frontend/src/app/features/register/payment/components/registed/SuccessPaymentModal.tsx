import { useNavigation } from "@/app/lib/navigation";
import React from "react";

const SuccessPaymentModal = () => {
	const { navigateDashboard } = useNavigation();
	return (
		<>
			<p className="text-center text-xs font-bold py-3 text-black">
				プランの購入が完了しました✨
				<br />
			</p>
			<button
				type="button"
				className="btn btn-sm sm:btn-md bg-green02 rounded-full border-none w-2/3 mx-auto text-white"
				onClick={navigateDashboard}
			>
				ホームへ
			</button>
		</>
	);
};

export default SuccessPaymentModal;
