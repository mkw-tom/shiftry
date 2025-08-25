import { API_URL } from "@/lib/env";
import type { ErrorResponse } from "@shared/api/common/types/errors";
import type { GetJobRolesResponse } from "@shared/api/jobRole/types/get";

export const getJobroles = async (
	jwt: string,
): Promise<GetJobRolesResponse | ErrorResponse> => {
	if (!jwt) {
		throw new Error("JWT is not found");
	}
	const res = await fetch(`${API_URL}/api/jobrole/all`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${jwt}`,
		},
	});

	const data = await res.json();

	return data;
};
