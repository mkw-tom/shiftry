import { API_URL } from "@/app/lib/env";
import type { AuthMeResponse } from "@shared/api/auth/types/me";
import type { ErrorResponse } from "@shared/api/common/types/errors";

export const getMe = async (
	jwt: string,
): Promise<AuthMeResponse | ErrorResponse> => {
	const res = await fetch(`${API_URL}/api/auth/me`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${jwt}`,
		},
	});

	const data = await res.json();
	return data;
};
