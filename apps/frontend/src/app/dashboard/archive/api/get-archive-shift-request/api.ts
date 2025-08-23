import { API_URL } from "@/app/lib/env";
import type { ErrorResponse } from "@shared/api/common/types/errors";
import type { GetArchiveShiftRequestsResponse } from "@shared/api/shift/request/types/get-archive";

export const getArchiveShiftRequests = async (
	jwt: string,
): Promise<GetArchiveShiftRequestsResponse | ErrorResponse> => {
	if (!jwt) {
		throw new Error("code is not found");
	}
	const res = await fetch(`${API_URL}/api/shift/request/archive`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${jwt}`,
		},
	});

	const data = await res.json();

	return data;
};
