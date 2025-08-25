import { API_URL } from "@/lib/env";
import type { VerifyLiffUserResponse } from "@shared/api/auth/types/liff-verify";
import type {
	ErrorResponse,
	ValidationErrorResponse,
} from "@shared/api/common/types/errors";

export const postVerifyLiff = async (
	idToken: string,
): Promise<
	VerifyLiffUserResponse | ErrorResponse | ValidationErrorResponse
> => {
	if (!idToken) throw new Error("idToken is not found");

	const res = await fetch(`${API_URL}/api/auth/liff/verify`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"x-id-token": idToken,
		},
	});

	const data = (await res.json()) as
		| VerifyLiffUserResponse
		| ErrorResponse
		| ValidationErrorResponse;

	return data;
};
