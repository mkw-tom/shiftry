import { API_URL } from "@/app/lib/env";
import type {
	ErrorResponse,
	ValidationErrorResponse,
} from "@shared/api/common/types/errors";
import type { DeleteManyShiftRequestResponse } from "@shared/api/shift/request/types/delete-many";

export const deleteManyShiftRequests = async ({
	userToken,
	storeToken,
	ids,
}: {
	userToken: string;
	storeToken: string;
	ids: string[];
}): Promise<
	DeleteManyShiftRequestResponse | ErrorResponse | ValidationErrorResponse
> => {
	if (!userToken) {
		throw new Error("code is not found");
	}
	if (!storeToken) {
		throw new Error("code is not found");
	}
	const res = await fetch(`${API_URL}/api/shift/request/bulk`, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${userToken}`,
			"x-store-id": storeToken,
		},
		body: JSON.stringify(ids),
	});

	const data = await res.json();

	return data;
};
