import { API_URL } from "@/lib/env";
import type {
	ErrorResponse,
	ValidationErrorResponse,
} from "@shared/api/common/types/errors";
import type { GetShiftRequestSpecificResponse } from "@shared/api/shift/request/types/get-by-id";

export const getShiftRequestSpecific = async ({
	jwt,
	shiftRequestId,
}: {
	jwt: string;
	shiftRequestId: string;
}): Promise<
	GetShiftRequestSpecificResponse | ErrorResponse | ValidationErrorResponse
> => {
	if (!jwt) {
		throw new Error("jwt is not found");
	}
	if (!shiftRequestId) {
		throw new Error("shiftRequestId is not found");
	}
	const res = await fetch(`${API_URL}/api/shift/request/${shiftRequestId}`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${jwt}`,
		},
	});

	const data = await res.json();

	return data;
};
