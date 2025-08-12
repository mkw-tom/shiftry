import type { Payment } from "../../common/types/prisma.js";

export interface CreatePaymentResponse {
	ok: true;
	payment: Payment;
}

export type PriceInterval = "day" | "week" | "month" | "year";

export type CreatePaymentInput = {
	storeId: string;
	userId: string;
	customerId: string;
	subscriptionId: string;
	productId: string;
	priceId: string;
	price_amount: number | null;
	price_interval: PriceInterval | undefined;
	subscription_status: string;
	isTrial: boolean;
	trial_end_date: Date;
	next_billing_date: Date;
	current_plan: string;
};
