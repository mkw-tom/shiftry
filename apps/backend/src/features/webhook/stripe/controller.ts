import type { ErrorResponse } from "@shared/common/types/errors";
import type { StripeWebhookResponse } from "@shared/webhook/stripe/types";
import type { Request, Response } from "express";
import { stripe } from "../../../config/stripe";
import { STRIPE_WEBHOOK_SECRET } from "../../../lib/env";
import stripeWebhookService from "./service";

const stripeWebhookController = async (
	req: Request,
	res: Response<StripeWebhookResponse | ErrorResponse>,
): Promise<void> => {
	const sig = req.headers["stripe-signature"] as string;

	try {
		const event = stripe.webhooks.constructEvent(
			req.body,
			sig,
			STRIPE_WEBHOOK_SECRET as string,
		);

		await stripeWebhookService(event);

		res.status(200).json({ received: true });
	} catch (error) {
		console.error("Stripe Webhook error:", error);
		res.status(400).json({ ok: false, message: "Webhook processing failed" });
	}
};

export default stripeWebhookController;
