import { API_URL } from "@/app/lib/env";

import type {
	ErrorResponse,
	ValidationErrorResponse,
} from "@shared/api/common/types/errors";
import type { StoreConnectLineGroupResponse } from "@shared/api/store/types/connect-line-group";

export const postConnectLineGroup = async (
	idToken: string,
	groupId_jwt: string,
	storeCode: string,
): Promise<
	StoreConnectLineGroupResponse | ErrorResponse | ValidationErrorResponse
> => {
	if (!idToken) {
		throw new Error("ID Token not found");
	}
	if (!groupId_jwt) {
		throw new Error("Group ID not found");
	}
	if (!storeCode) {
		throw new Error("Store code not found");
	}

	const res = await fetch(`${API_URL}/api/store/connect-line-group`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			"x-id-token": idToken,
			"x-group-id": groupId_jwt,
			"x-store-code": storeCode,
		},
	});

	const data = await res.json();
	return data;
};
