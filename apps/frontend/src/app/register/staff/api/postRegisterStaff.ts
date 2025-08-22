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
	idToken,
	storeCode,
	userInput,
}: {
	idToken: string;
	storeCode: string;
	userInput: userInputType;
}): Promise<
	RegisterStaffResponse | ErrorResponse | ValidationErrorResponse
> => {
	if (!idToken) {
		throw new Error("ID Token not found");
	}
	if (!storeCode) {
		throw new Error("Store code not found");
	}
	if (!userInput || !userInput.name || !userInput.pictureUrl) {
		throw new Error("User input is invalid");
	}

	const res = await fetch(`${API_URL}/api/auth/register/staff`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"x-id-token": idToken,
			"x-store-code": storeCode,
		},
		body: JSON.stringify({ userInput: userInput }),
	});

	const data = await res.json();

	return data;
};
