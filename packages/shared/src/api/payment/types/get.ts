import type { Payment } from "../../common/types/prisma.js";

export interface GetPaymentResponse {
	ok: true;
	payment: Payment;
}
