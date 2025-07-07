import type { Payment } from "../../common/types/prisma";

export interface ChangePalnResponse {
	ok: true;
	updatedPayment: Payment;
}
