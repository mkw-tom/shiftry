import { API_URL } from "@/app/lib/env";
import type {
	ErrorResponse,
	ValidationErrorResponse,
} from "@shared/api/common/types/errors";
import type { GetSubmittedShiftUserOneResponse } from "@shared/api/shift/submit/types/get-one";

export const getSubmittedShiftUserOne = async ({
	userToken,
	storeToken,
	shiftRequestId,
}: {
	userToken: string;
	storeToken: string;
	shiftRequestId: string;
}): Promise<
	GetSubmittedShiftUserOneResponse | ErrorResponse | ValidationErrorResponse
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
	const res = await fetch(`${API_URL}/api/shift/submit/one/${shiftRequestId}`, {
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
