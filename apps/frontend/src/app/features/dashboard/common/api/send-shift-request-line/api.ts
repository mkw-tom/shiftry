import { API_URL } from "@/app/lib/env";
import type {
	ErrorResponse,
	ValidationErrorResponse,
} from "@shared/common/types/errors";
import type { LineMessageAPIResponse } from "@shared/webhook/line/types";

export const sendShiftRequest = async ({
	userToken,
	storeToken,
	groupToken,
}: {
	userToken: string;
	storeToken: string;
	groupToken: string;
}): Promise<
	LineMessageAPIResponse | ErrorResponse | ValidationErrorResponse
> => {
	if (!userToken) {
		throw new Error("code is not found");
	}
	if (!storeToken) {
		throw new Error("code is not found");
	}
	if (!groupToken) {
		throw new Error("code is not found");
	}
	const res = await fetch(`${API_URL}/webhook/line/request-shift`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${userToken}`,
			"x-store-id": storeToken,
			"x-group-id": groupToken,
		},
	});

	const data = await res.json();

	return data;
};
