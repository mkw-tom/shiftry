import { API_URL } from "@/lib/env";
import type {
	ErrorResponse,
	ValidationErrorResponse,
} from "@shared/api/common/types/errors";
import type { GetSubmittedShiftUserOneResponse } from "@shared/api/shift/submit/types/get-one";

export const getSubmittedShiftUserOne = async ({
	jwt,
	shiftRequestId,
}: {
	jwt: string;
	shiftRequestId: string;
}): Promise<
	GetSubmittedShiftUserOneResponse | ErrorResponse | ValidationErrorResponse
> => {
	if (!jwt) {
		throw new Error("jwt is not found");
	}
	if (!shiftRequestId) {
		throw new Error("shiftRequestId is not found");
	}
	const res = await fetch(`${API_URL}/api/shift/submit/one/${shiftRequestId}`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${jwt}`,
		},
	});

	const data = await res.json();

	return data;
};
