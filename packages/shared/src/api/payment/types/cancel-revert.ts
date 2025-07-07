import type { Payment } from "../../common/types/prisma";

export interface CancelRevertResponse {
	ok: true;
	revertPayment: Payment;
}
