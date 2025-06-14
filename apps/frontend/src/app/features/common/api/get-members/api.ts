import { API_URL } from "@/app/lib/env";
import type {
	ErrorResponse,
	ValidationErrorResponse,
} from "@shared/common/types/errors";
import type { GetUsersFromStoreResponse } from "@shared/user/types/get";

export const getMembers = async (
	userToken: string | null,
	storeToken: string | null,
): Promise<
	GetUsersFromStoreResponse | ErrorResponse | ValidationErrorResponse
> => {
	if (userToken === null) {
		throw new Error("userToken is not found");
	}
	if (storeToken === null) {
		throw new Error("groupToken is not found");
	}
	const res = await fetch(`${API_URL}/api/user`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${userToken}`,
			"x-store-id": storeToken,
		},
	});

	const data = await res.json();
	return data;
};
