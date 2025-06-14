import { API_URL } from "@/app/lib/env";
import type { InitResponse } from "@shared/auth/types/init";
import type {
	ErrorResponse,
	ValidationErrorResponse,
} from "@shared/common/types/errors";

export const init = async ({
	userToken,
	storeId,
}: {
	userToken: string;
	storeId: string;
}): Promise<InitResponse | ErrorResponse | ValidationErrorResponse> => {
	if (!userToken) {
		throw new Error("code is not found");
	}
	if (!storeId) {
		throw new Error("code is not found");
	}
	const res = await fetch(`${API_URL}/api/auth/init`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${userToken}`,
		},
		body: JSON.stringify({ storeId: storeId }),
	});

	const data = await res.json();

	return data;
};
