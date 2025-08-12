import type { Payment } from "@prisma/client";

import type { createPaymentType } from "@shared/api/payment/validations/post.js";
import { stripe } from "../../../config/stripe.js";
import { STRIPE_TRIAL_DAYS } from "../../../lib/env.js";
import { createPayment } from "../../../repositories/payment.repositroy.js";
import { getStoreById } from "../../../repositories/store.repository.js";

const createPaymentService = async ({
	userId,
	storeId,
	paymentInfos,
}: {
	userId: string;
	storeId: string;
	paymentInfos: createPaymentType;
}): Promise<Payment> => {
	const store = await getStoreById(storeId);
	const { email, productId, paymentMethodId } = paymentInfos;

	const customer = await stripe.customers.create({
		email,
		name: store?.name,
		metadata: { userId, storeId },
	});

	await stripe.paymentMethods.attach(paymentMethodId, {
		customer: customer.id,
	});

	// 顧客の支払い方法をデフォルト設定
	await stripe.customers.update(customer.id, {
		invoice_settings: {
			default_payment_method: paymentMethodId,
		},
	});

	const product = await stripe.products.retrieve(productId);
	const prices = await stripe.prices.list({ product: productId });
	const price = prices.data[0];

	const subscription = await stripe.subscriptions.create({
		customer: customer.id,
		items: [{ price: price.id }],
		trial_period_days: Number(STRIPE_TRIAL_DAYS) || 60,
		metadata: { storeId },
	});

	const trialEnd = new Date((subscription.trial_end as number) * 1000);
	const nextBilling = new Date(
		(subscription.current_period_end as number) * 1000,
	);

	const data = {
		storeId,
		userId,
		customerId: customer.id,
		subscriptionId: subscription.id,
		productId,
		priceId: price.id,
		price_amount: price.unit_amount,
		price_interval: price.recurring?.interval,
		subscription_status: subscription.status,
		isTrial: true,
		trial_end_date: trialEnd,
		next_billing_date: nextBilling,
		current_plan: product.name, // or 判定式でもOK
	};
	const payment = await createPayment(data);

	return payment;
};

export default createPaymentService;
