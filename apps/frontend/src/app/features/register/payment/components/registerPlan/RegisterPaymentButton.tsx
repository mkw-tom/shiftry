import type { createPaymentType } from "@shared/api/payment/validations/post";
import React from "react";
import { useRegisterPaymentHandler } from "../../hooks/useRegisterPaymentHandler";

const RegisterPaymentButton = ({
	payload,
	handleCardAuth,
	disabled,
}: {
	payload: createPaymentType;
	handleCardAuth: () => void;
	disabled: boolean;
}) => {
	const { handleRegisterPayment } = useRegisterPaymentHandler({ payload });

	return (
		<button
			type="button"
			className="btn btn-sm sm:btn-md bg-green02 rounded-full border-none w-2/3 mx-auto text-white"
			onClick={payload.paymentMethodId ? handleRegisterPayment : handleCardAuth}
			disabled={disabled}
		>
			{payload.paymentMethodId ? "購入を確定" : "決済情報を認証"}
		</button>
	);
};

export default RegisterPaymentButton;
