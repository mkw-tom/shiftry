import type { Payment } from "../../common/types/prisma";

export interface GetPaymentResponse {
	ok: true;
	payment: Payment;
}
