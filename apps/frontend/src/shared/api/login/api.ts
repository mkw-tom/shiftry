import { API_URL } from "@/app/lib/env";
import type { LoginControllerResponse } from "@shared/api/auth/types/login";
import type { ErrorResponse } from "@shared/api/common/types/errors";

export const postLogin = async (
	jwt: string,
): Promise<LoginControllerResponse | ErrorResponse> => {
	const res = await fetch(`${API_URL}/api/auth/login`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${jwt}`,
		},
	});

	const data = await res.json();
	return data;
};
