import { API_URL } from "@/app/lib/env";
import type {
	ErrorResponse,
	ValidationErrorResponse,
} from "@shared/common/types/errors";
import type { UpsertShiftRequetResponse } from "@shared/shift/request/types/put";
import type { UpsertShiftRequetType } from "@shared/shift/request/validations/put";

export const upsertShiftRequest = async ({
	userToken,
	storeToken,
	formData,
}: {
	userToken: string;
	storeToken: string;
	formData: UpsertShiftRequetType;
}): Promise<
	UpsertShiftRequetResponse | ErrorResponse | ValidationErrorResponse
> => {
	if (!userToken) {
		throw new Error("code is not found");
	}
	if (!storeToken) {
		throw new Error("code is not found");
	}
	const res = await fetch(`${API_URL}/api/shift/request`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${userToken}`,
			"x-store-id": storeToken,
		},
		body: JSON.stringify(formData),
	});

	const data = await res.json();

	return data;
};
