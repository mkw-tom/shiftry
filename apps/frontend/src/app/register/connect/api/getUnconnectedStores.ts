import { API_URL } from "@/app/lib/env";

import type {
	ErrorResponse,
	ValidationErrorResponse,
} from "@shared/api/common/types/errors";
import type { GetUnconnectedStoresMeResponse } from "@shared/api/store/types/me-unconnected";

export const getUnconnectedStores = async (
	jwt: string,
): Promise<GetUnconnectedStoresMeResponse | ErrorResponse> => {
	if (jwt === null) {
		throw new Error("jw is not found");
	}

	const res = await fetch(`${API_URL}/api/store/me/unconnected`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${jwt}`,
		},
	});

	const data = await res.json();
	return data;
};
