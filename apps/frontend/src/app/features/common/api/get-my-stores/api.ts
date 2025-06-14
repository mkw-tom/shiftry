import { API_URL } from "@/app/lib/env";
import type {
	ErrorResponse,
	ValidationErrorResponse,
} from "@shared/common/types/errors";
import type { GetStoresFromUserResponse } from "@shared/store/types/me";

export const getMyStores = async (
	userToken: string | null,
	storeToken: string | null,
): Promise<
	GetStoresFromUserResponse | ErrorResponse | ValidationErrorResponse
> => {
	if (userToken === null) {
		throw new Error("userToken is not found");
	}
	if (storeToken === null) {
		throw new Error("groupToken is not found");
	}
	const res = await fetch(`${API_URL}/api/store/me`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${userToken}`,
		},
	});

	const data = await res.json();
	return data;
};
