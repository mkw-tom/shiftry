import { API_URL } from "@/app/lib/env";
import type {
	ErrorResponse,
	ValidationErrorResponse,
} from "@shared/api/common/types/errors";
import type { UpsertSubmittedShfitResponse } from "@shared/api/shift/submit/types/put";
import type {
	UpsertSubmittedShiftFormType,
	UpsertSubmittedShiftInputType,
} from "@shared/api/shift/submit/validations/put";

export const upsertSubmitShift = async ({
	userToken,
	storeToken,
	formData,
}: {
	userToken: string;
	storeToken: string;
	formData: UpsertSubmittedShiftFormType;
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
