import { API_URL } from "@/app/lib/env";
import type { AutoLoginResponse } from "@shared/auth/types/auto-login";
import type {
	ErrorResponse,
	ValidationErrorResponse,
} from "@shared/common/types/errors";

export const autoLogin = async ({
	userToken,
	storeToken,
	groupToken,
}: {
	userToken: string;
	storeToken: string;
	groupToken: string;
}): Promise<AutoLoginResponse | ErrorResponse | ValidationErrorResponse> => {
	if (!userToken) {
		throw new Error("code is not found");
	}
	if (!storeToken) {
		throw new Error("code is not found");
	}
	if (!groupToken) {
		throw new Error("code is not found");
	}
	const res = await fetch(`${API_URL}/api/auth/auto-login`, {
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
