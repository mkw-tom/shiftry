// import { API_URL } from "@/app/lib/env";
// import type { ReLoginResponse } from "@shared/auth/types/re-login";
// import type {
// 	ErrorResponse,
// 	ValidationErrorResponse,
// } from "@shared/common/types/errors";

// export const reLogin = async (
// 	lineToken: string | null,
// ): Promise<ReLoginResponse | ErrorResponse | ValidationErrorResponse> => {
// 	if (lineToken === null) {
// 		throw new Error("lineToken is not found");
// 	}
// 	const res = await fetch(`${API_URL}/api/auth/re-login`, {
// 		method: "POST",
// 		headers: {
// 			"Content-Type": "application/json",
// 			"x-line-id": lineToken,
// 		},
// 	});

// 	const data = await res.json();
// 	return data;
// };
