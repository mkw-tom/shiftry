import { API_URL } from "@/app/lib/env";

import type {
	ErrorResponse,
	ValidationErrorResponse,
} from "@shared/api/common/types/errors";
import type { StoreConnectLineGroupResponse } from "@shared/api/store/types/connect-line-group";

export const postConnectLineGroup = async (
	idToken: string,
	channelId: string,
	channelType: "group",
	storeId: string,
): Promise<
	StoreConnectLineGroupResponse | ErrorResponse | ValidationErrorResponse
> => {
	if (!idToken) {
		throw new Error("ID Token not found");
	}
	if (!storeId) {
		throw new Error("Store ID not found");
	}
	if (!channelType) {
		throw new Error("Channel Type not found");
	}
	if (!channelId) {
		throw new Error("Channel ID not found");
	}

	const res = await fetch(`${API_URL}/api/store/connect-line-group`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			"x-id-token": idToken,
			// "x-group-id": groupId,
			// "x-store-code": storeCode
		},
	});

	const data = await res.json();
	return data;
};
