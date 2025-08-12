import type { Payment } from "@shared/api/common/types/prisma.js";
import prisma from "../config/database.js";
import type { CreatePaymentInput } from "../types/inputs.js";

export const createPayment = async (
	data: CreatePaymentInput,
): Promise<Payment> => {
	return await prisma.payment.create({ data });
};

export const getPaymentByStoreId = async (
	storeId: string,
): Promise<Payment | null> => {
	return await prisma.payment.findUnique({ where: { storeId } });
};

export const updatePaymentPlan = async (
	storeId: string,
	data: {
		productId: string;
		priceId: string;
		current_plan: string;
		price_amount: number;
		price_interval: string;
	},
): Promise<Payment> => {
	return await prisma.payment.update({
		where: { storeId },
		data,
	});
};

export const cancelSubscription = async (
	storeId: string,
	cancelDate: Date,
): Promise<Payment> => {
	return await prisma.payment.update({
		where: { storeId },
		data: {
			cancel_requested_at: new Date(),
			cancel_at_period_end: true,
			delete_scheduled_at: cancelDate,
		},
	});
};

export const cancelRevert = async (storeId: string): Promise<Payment> => {
	return await prisma.payment.update({
		where: { storeId },
		data: {
			cancel_requested_at: null,
			cancel_at_period_end: false,
			delete_scheduled_at: null,
		},
	});
};
