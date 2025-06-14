import { API_URL } from "@/app/lib/env";
import type {
	ErrorResponse,
	ValidationErrorResponse,
} from "@shared/common/types/errors";
import type { GetAssigShiftResponse } from "@shared/shift/assign/types/get-by-shift-request-id";

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
	if (!userToken) {
		throw new Error("code is not found");
	}
	if (!storeToken) {
		throw new Error("code is not found");
	}
	if (!shiftRequestId) {
		throw new Error("shiftRequestId is not found");
	}
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
