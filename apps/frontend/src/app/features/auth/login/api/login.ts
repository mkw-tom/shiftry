import { API_URL } from "@/app/lib/env";
import type { LoginResponse } from "@shared/api/auth/types/login";
import type {
	ErrorResponse,
	ValidationErrorResponse,
} from "@shared/api/common/types/errors";

export const login = async (
	lineToken: string,
): Promise<LoginResponse | ErrorResponse | ValidationErrorResponse> => {
	if (!lineToken) {
		throw new Error("code is not found");
	}
	const res = await fetch(`${API_URL}/api/auth/login`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"x-line-id": lineToken,
		},
	});

	const data = await res.json();

	return data;
};
