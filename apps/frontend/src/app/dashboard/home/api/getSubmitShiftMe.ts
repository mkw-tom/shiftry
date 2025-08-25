import { API_URL } from "@/lib/env";
import type { ErrorResponse } from "@shared/api/common/types/errors";
import type { GetSubmittedShiftMeResponse } from "@shared/api/shift/submit/types/get-me";

export const getSubmittedShiftMe = async (
	jwt: string,
): Promise<GetSubmittedShiftMeResponse | ErrorResponse> => {
	const res = await fetch(`${API_URL}/api/shift/submit/me`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${jwt}`,
		},
	});

	const data = await res.json();

	return data;
};
