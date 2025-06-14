import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useState } from "react";
import { toast } from "react-toastify";

const usePaymentMethodId = ({ email }: { email: string }) => {
	const [paymentMethodId, setPaymentMethodId] = useState<string | null>(null);
	const [error, setError] = useState<boolean | null>(null);
	const stripe = useStripe();
	const elements = useElements();

	const handleCardAuth = async () => {
		if (!stripe || !elements) {
			toast.error("Stripeの初期化がまだ完了していません。");
			window.alert("Stripeの初期化がまだ完了していません。");
			setError(false);
			return;
		}

		const cardElement = elements.getElement(CardElement);
		if (!cardElement) {
			toast.error("カード入力欄が見つかりませんでした。");
			window.alert("カード入力欄が見つかりませんでした。");
			setError(false);
			return;
		}

		const { paymentMethod, error } = await stripe.createPaymentMethod({
			type: "card",
			card: cardElement,
			billing_details: { email },
		});

		if (error) {
			toast.error(error.message || "カード認証に失敗しました。");
			window.alert("カード認証に失敗しました");
			setError(false);
			return;
		}

		setPaymentMethodId(paymentMethod.id);
		toast.success("カード情報の認証に成功しました！");
		setError(true);
	};

	return { paymentMethodId, handleCardAuth, error };
};

export default usePaymentMethodId;
