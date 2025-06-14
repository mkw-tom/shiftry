import type { Payment } from "@shared/common/types/prisma";
import { stripe } from "../../../config/stripe";
import {
	cancelRevert,
	getPaymentByStoreId,
} from "../../../repositories/payment.repositroy";

const cancelRevertService = async ({
	storeId,
}: {
	storeId: string;
}): Promise<Payment> => {
	const payment = await getPaymentByStoreId(storeId);
	if (!payment) throw new Error("Payment not found");

	await stripe.subscriptions.update(payment.subscriptionId, {
		cancel_at_period_end: false,
	});

	const revertPayment = await cancelRevert(storeId);

	return revertPayment;
};

export default cancelRevertService;
