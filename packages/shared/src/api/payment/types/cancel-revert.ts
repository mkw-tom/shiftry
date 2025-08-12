import type { Payment } from "../../common/types/prisma.js";

export interface CancelRevertResponse {
	ok: true;
	revertPayment: Payment;
}
