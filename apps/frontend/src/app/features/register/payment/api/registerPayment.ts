import { API_URL } from "@/app/lib/env";
import type {
	ErrorResponse,
	ValidationErrorResponse,
} from "@shared/api/common/types/errors";
import type { CreatePaymentResponse } from "@shared/api/payment/types/post";
import type { createPaymentType } from "@shared/api/payment/validations/post";

export const postCreatePayment = async (
	userToken: string | null,
	storeToken: string | null,
	payload: createPaymentType,
): Promise<CreatePaymentResponse | ErrorResponse | ValidationErrorResponse> => {
	if (userToken === null) {
		throw new Error("userToken is not found");
	}
	if (storeToken === null) {
		throw new Error("storeToken is not found");
	}

	const res = await fetch(`${API_URL}/api/payment`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${userToken}`,
			"x-store-id": storeToken,
		},
		body: JSON.stringify(payload),
	});
	console.log(payload);

	const data = await res.json();
	return data;
};
