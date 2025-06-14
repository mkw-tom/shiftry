import type { CancelSubscriptionServiceResponse } from "@shared/payment/types/cancel";
import { stripe } from "../../../config/stripe";
import {
	cancelSubscription,
	getPaymentByStoreId,
} from "../../../repositories/payment.repositroy";

const cancelSubscriptionService = async ({
	storeId,
}: {
	storeId: string;
}): Promise<CancelSubscriptionServiceResponse> => {
	const payment = await getPaymentByStoreId(storeId);
	if (!payment) throw new Error("Payment not found");

	// Stripeのサブスクを次回請求でキャンセル予約
	const subscription = await stripe.subscriptions.update(
		payment.subscriptionId,
		{ cancel_at_period_end: true },
	);

	const cancelDate = new Date(subscription.current_period_end * 1000);

	const canceledPayment = await cancelSubscription(storeId, cancelDate);

	return { canceledPayment, cancelDate };
};

export default cancelSubscriptionService;
