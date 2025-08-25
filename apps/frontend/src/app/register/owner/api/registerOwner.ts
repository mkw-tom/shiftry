import { API_URL } from "@/lib/env";
import type { RegisterOwnerResponse } from "@shared/api/auth/types/register-owner";
import type {
	StoreNameType,
	userInputType,
} from "@shared/api/auth/validations/register-owner";
import type {
	ErrorResponse,
	ValidationErrorResponse,
} from "@shared/api/common/types/errors";

export const postRegisterOwner = async (
	idToken: string,
	userInput: userInputType,
	storeName: StoreNameType,
): Promise<RegisterOwnerResponse | ErrorResponse | ValidationErrorResponse> => {
	const payload = {
		userInput: userInput,
		storeInput: storeName,
	};

	const res = await fetch(`${API_URL}/api/auth/register/owner`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"x-id-token": idToken,
		},
		body: JSON.stringify(payload),
	});

	const data = await res.json();

	return data;
};
