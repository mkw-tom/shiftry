import type { Stripe } from "stripe";
import { deleteStore } from "../../../repositories/store.repository";

const stripeWebhookService = async (event: Stripe.Event) => {
	switch (event.type) {
		case "customer.subscription.deleted": {
			const subscription = event.data.object as Stripe.Subscription;
			const storeId = subscription.metadata.storeId;

			if (!storeId) {
				throw new Error("Missing storeId in metadata");
			}

			await deleteStore(storeId);
			break;
		}

		// 他のイベントもここに追加できる
		default:
			console.log(`Unhandled event type: ${event.type}`);
	}
};

export default stripeWebhookService;
