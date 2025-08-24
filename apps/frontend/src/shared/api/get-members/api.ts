import { API_URL } from "@/app/lib/env";
import type {
	ErrorResponse,
	ValidationErrorResponse,
} from "@shared/api/common/types/errors";
import type { GetMemberFromStoreResponse } from "@shared/api/user/types/get-member";

export const getMembers = async (
	jwt: string,
): Promise<
	GetMemberFromStoreResponse | ErrorResponse | ValidationErrorResponse
> => {
	if (!jwt) {
		throw new Error("JWT not found");
	}
	const res = await fetch(`${API_URL}/api/user/member`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${jwt}`,
		},
	});

	const data = await res.json();
	return data;
};
