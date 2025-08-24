import { API_URL } from "@/app/lib/env";
import type {
	ErrorResponse,
	ValidationErrorResponse,
} from "@shared/api/common/types/errors";
import type { UpsertShiftRequetResponse } from "@shared/api/shift/request/types/put";
import type { UpsertShiftRequetType } from "@shared/api/shift/request/validations/put";

export const upsertShiftRequest = async (
	jwt: string,
	formData: UpsertShiftRequetType,
): Promise<
	UpsertShiftRequetResponse | ErrorResponse | ValidationErrorResponse
> => {
	if (!jwt) {
		throw new Error("JWT is not found");
	}
	const res = await fetch(`${API_URL}/api/shift/request`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${jwt}`,
		},
		body: JSON.stringify(formData),
	});

	const data = await res.json();

	return data;
};
