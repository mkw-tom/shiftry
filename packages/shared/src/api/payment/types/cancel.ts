import type { Payment } from "../../common/types/prisma";

export interface CancelSubscriptionResponse {
	ok: true;
	canceledPayment: Payment;
	cancelDate: Date;
}

export interface CancelSubscriptionServiceResponse {
	canceledPayment: Payment;
	cancelDate: Date;
}
