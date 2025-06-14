import type { productIdType } from "@shared/payment/validations/change-plan";
import { stripe } from "../../../config/stripe";
import {
	getPaymentByStoreId,
	updatePaymentPlan,
} from "../../../repositories/payment.repositroy";

const changePlanService = async ({
	storeId,
	productId,
}: {
	storeId: string;
	productId: productIdType["productId"];
}) => {
	const payment = await getPaymentByStoreId(storeId);
	if (!payment) throw new Error("Payment info not found");

	const prices = await stripe.prices.list({ product: productId });
	const price = prices.data[0]; // ※月額1つならOK（将来複数あればフィルタ追加）

	const product = await stripe.products.retrieve(productId);
	const planName = product.metadata.plan_type || product.name;

	const subscription = await stripe.subscriptions.retrieve(
		payment.subscriptionId,
	);
	const itemId = subscription.items.data[0].id;

	await stripe.subscriptions.update(payment.subscriptionId, {
		items: [
			{
				id: itemId,
				price: price.id,
			},
		],
	});

	const updatedPayment = await updatePaymentPlan(storeId, {
		productId,
		priceId: price.id,
		price_amount: price.unit_amount ?? 0,
		price_interval: price.recurring?.interval ?? "month",
		current_plan: planName,
	});

	return updatedPayment;
};

export default changePlanService;
