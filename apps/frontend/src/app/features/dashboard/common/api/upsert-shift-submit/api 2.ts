import { API_URL } from "@/app/lib/env";
import type {
	ErrorResponse,
	ValidationErrorResponse,
} from "@shared/common/types/errors";
import type { UpsertSubmittedShfitResponse } from "@shared/shift/submit/types/put";
import type { UpsertSubmittedShiftInputType } from "@shared/shift/submit/validations/put";

export const upsertSubmitShift = async ({
	userToken,
	storeToken,
	formData,
}: {
	userToken: string;
	storeToken: string;
	formData: UpsertSubmittedShiftInputType;
}): Promise<
	UpsertSubmittedShfitResponse | ErrorResponse | ValidationErrorResponse
> => {
	if (!userToken) {
		throw new Error("code is not found");
	}
	if (!storeToken) {
		throw new Error("code is not found");
	}
	const res = await fetch(`${API_URL}/api/shift/submit`, {
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
