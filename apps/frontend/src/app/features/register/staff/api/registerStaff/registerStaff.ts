import { API_URL } from "@/app/lib/env";
import type { RegisterStaffResponse } from "@shared/api/auth/types/register-staff";
import type {
	storeIdandShfitReruestIdType,
	userInputType,
} from "@shared/api/auth/validations/register-staff";
import type {
	ErrorResponse,
	ValidationErrorResponse,
} from "@shared/api/common/types/errors";

export const postRegisterStaff = async ({
	lineToken,
	userInput,
	storeInput,
}: {
	lineToken: string;
	userInput: userInputType;
	storeInput: storeIdandShfitReruestIdType;
}): Promise<
	RegisterStaffResponse | ErrorResponse | ValidationErrorResponse
> => {
	const payload = {
		userInput,
		storeInput,
	};

	const res = await fetch(`${API_URL}/api/auth/register-staff`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"x-line-id": lineToken,
		},
		body: JSON.stringify(payload),
	});

	const data = await res.json();

	return data;
};
