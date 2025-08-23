import { API_URL } from "@/app/lib/env";
import type {
	ErrorResponse,
	ValidationErrorResponse,
} from "@shared/api/common/types/errors";
import type { DeleteManyShiftRequestResponse } from "@shared/api/shift/request/types/delete-many";

export const deleteManyShiftRequests = async (
	jwt: string,
	ids: string[],
): Promise<
	DeleteManyShiftRequestResponse | ErrorResponse | ValidationErrorResponse
> => {
	if (!jwt) {
		throw new Error("JWT is not found");
	}
	const res = await fetch(`${API_URL}/api/shift/request/bulk`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${jwt}`,
		},
		body: JSON.stringify({ ids }),
	});

	const data = await res.json();

	return data;
};
