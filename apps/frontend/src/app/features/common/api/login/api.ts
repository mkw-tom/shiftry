// import { API_URL } from "@/app/lib/env";
// import type { LoginResponse } from "@shared/auth/types/login";
// import type {
// 	ErrorResponse,
// 	ValidationErrorResponse,
// } from "@shared/common/types/errors";

// export const Login = async (
// 	userToken: string | null,
// ): Promise<LoginResponse | ErrorResponse | ValidationErrorResponse> => {
// 	if (userToken === null) {
// 		throw new Error("userToken is not found");
// 	}
// 	const res = await fetch(`${API_URL}/api/auth/init`, {
// 		method: "POST",
// 		headers: {
// 			"Content-Type": "application/json",
// 			Authorization: `Bearer ${userToken}`,
// 		},
// 	});

// 	const data = await res.json();
// 	return data;
// };
