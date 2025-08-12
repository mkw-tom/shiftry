import type { Payment } from "../../common/types/prisma.js";

export interface ChangePalnResponse {
	ok: true;
	updatedPayment: Payment;
}
