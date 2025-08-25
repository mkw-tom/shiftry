import { API_URL } from "@/lib/env";

import type { SelectStoreResponse } from "@shared/api/auth/types/select-store";
import type { ErrorResponse } from "@shared/api/common/types/errors";

export const postSelectStore = async (
	jwt: string,
	storeId: string,
): Promise<SelectStoreResponse | ErrorResponse> => {
	const res = await fetch(`${API_URL}/api/auth/select-store`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${jwt}`,
		},
		body: JSON.stringify({ storeId }),
	});

	const data = await res.json();
	return data;
};
