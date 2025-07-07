import { API_URL } from "@/app/lib/env";
import type {
	ErrorResponse,
	ValidationErrorResponse,
} from "@shared/api/common/types/errors";
import type { GetAssigShiftResponse } from "@shared/api/shift/assign/types/get-by-shift-request-id";

export const getAssignShift = async ({
	userToken,
	storeToken,
	shiftRequestId,
}: {
	userToken: string;
	storeToken: string;
	shiftRequestId: string;
}): Promise<
	GetAssigShiftResponse | ErrorResponse | ValidationErrorResponse
> => {
	const res = await fetch(`${API_URL}/api/shift/assign/${shiftRequestId}`, {
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
