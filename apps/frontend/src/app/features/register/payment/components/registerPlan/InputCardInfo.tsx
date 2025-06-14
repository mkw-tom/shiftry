import { CardElement } from "@stripe/react-stripe-js";
import React from "react";

const InputCardInfo = () => {
	return (
		<div className="w-full flex flex-col gap-3 border-b-1 border-gray01 pb-1">
			<p className="text-sm font-semibold text-gray02">カード情報</p>
			<CardElement
				options={{
					style: {
						base: {
							fontSize: "12px",
							color: "#333",
							"::placeholder": { color: "#a0a0a0" },
						},
						invalid: {
							color: "#ff4d4f",
						},
					},
				}}
			/>
		</div>
	);
};

export default InputCardInfo;
