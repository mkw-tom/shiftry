import type { ErrorResponse } from "@shared/api/common/types/errors.js";
import type { StripeWebhookResponse } from "@shared/api/webhook/stripe/types.js";
import type { Request, Response } from "express";
import { stripe } from "../../../config/stripe.js";
import { STRIPE_WEBHOOK_SECRET } from "../../../lib/env.js";
import stripeWebhookService from "./service.js";

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
