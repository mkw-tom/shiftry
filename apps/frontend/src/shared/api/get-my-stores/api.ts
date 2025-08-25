import { API_URL } from "@/lib/env";
import type {
	ErrorResponse,
	ValidationErrorResponse,
} from "@shared/api/common/types/errors";
import type { GetStoresFromUserResponse } from "@shared/api/store/types/me";

export const getMyStores = async (
	jwt: string,
): Promise<
	GetStoresFromUserResponse | ErrorResponse | ValidationErrorResponse
> => {
	if (!jwt) {
		throw new Error("JWTトークンが見つかりません");
	}
	const res = await fetch(`${API_URL}/api/store/me`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${jwt}`,
		},
	});

	const data = await res.json();
	return data;
};
