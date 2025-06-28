import { YMDHM } from "@/app/features/common/hooks/useFormatDate";
import type { RootState } from "@/app/redux/store";
import React from "react";
import { useSelector } from "react-redux";

const PaymentSectionContent = () => {
	const { Payment } = useSelector((state: RootState) => state.payment);

	return (
		<div className="collapse-content">
			<div className="mx-5 mt-4 mb-6">
				<div className="badge bg-green01 border-none badge-sm rounded-full font-bold text-white">
					{Payment?.current_plan}
				</div>
				<p className="mt-4 text-center">
					<span className="text-black text-xl font-bold">
						¥{Payment?.price_amount}
					</span>
					<span className="mx-2 text-black font-bold text-xs">/</span>
					<span className="text-md text-black font-bold text-xs">月</span>
				</p>

				<p className="text-black text-center text-xs mt-3">
					次回お支払い：
					{Payment?.next_billing_date
						? YMDHM(new Date(Payment?.next_billing_date))
						: ""}
				</p>
				<button
					type="button"
					className="border-2 border-green01 text-green01 font-bold w-full rounded-full text-xs py-1 mt-3"
				>
					お支払い情報を変更
				</button>
			</div>
		</div>
	);
};

export default PaymentSectionContent;
