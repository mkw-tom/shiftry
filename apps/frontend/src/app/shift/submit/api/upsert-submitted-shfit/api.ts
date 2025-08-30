import { API_URL } from "@/lib/env";
import type {
	ErrorResponse,
	ValidationErrorResponse,
} from "@shared/api/common/types/errors";
import type { UpsertSubmittedShfitResponse } from "@shared/api/shift/submit/types/put";
import type { UpsertSubmittedShiftInput } from "@shared/api/shift/submit/validations/put";

export const upsertSubmitShift = async ({
	jwt,
	formData,
}: {
	jwt: string;
	formData: UpsertSubmittedShiftInput;
}): Promise<
	UpsertSubmittedShfitResponse | ErrorResponse | ValidationErrorResponse
> => {
	if (!jwt) {
		throw new Error("code is not found");
	}
	if (!formData) {
		throw new Error("formData is not found");
	}

	const res = await fetch(`${API_URL}/api/shift/submit`, {
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
