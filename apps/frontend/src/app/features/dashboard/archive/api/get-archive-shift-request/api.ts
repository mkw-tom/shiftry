import { API_URL } from "@/app/lib/env";
import type {
	ErrorResponse,
	ValidationErrorResponse,
} from "@shared/api/common/types/errors";
import type { GetShiftRequestResponse } from "@shared/api/shift/request/types/get";

export const getArchiveShiftRequests = async ({
	userToken,
	storeToken,
}: {
	userToken: string;
	storeToken: string;
}): Promise<GetShiftRequestResponse | ErrorResponse> => {
	if (!userToken) {
		throw new Error("code is not found");
	}
	if (!storeToken) {
		throw new Error("code is not found");
	}
	const res = await fetch(`${API_URL}/api/shift/request/archive`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${userToken}`,
			"x-store-id": storeToken,
		},
	});

	const data = await res.json();

	return data;
};
