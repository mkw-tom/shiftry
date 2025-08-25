import { API_URL } from "@/lib/env";
import type { LoginResponse } from "@shared/api/auth/types/login";
import type { ErrorResponse } from "@shared/api/common/types/errors";

export const postLogin = async (
	jwt: string,
): Promise<LoginResponse | ErrorResponse> => {
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
