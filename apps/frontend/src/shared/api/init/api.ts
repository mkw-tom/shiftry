import { API_URL } from "@/lib/env";
import type { InitResponse } from "@shared/api/auth/types/init";
import type {
	ErrorResponse,
	ValidationErrorResponse,
} from "@shared/api/common/types/errors";

export const init = async (
	userToken: string | null,
	storeId: string,
): Promise<InitResponse | ErrorResponse | ValidationErrorResponse> => {
	if (userToken === null) {
		throw new Error("userToken is not found");
	}
	const res = await fetch(`${API_URL}/api/auth/init`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${userToken}`,
		},
		body: JSON.stringify({
			storeId: storeId,
		}),
	});

	const data = await res.json();
	return data;
};
