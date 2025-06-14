import { API_URL } from "@/app/lib/env";
import type { RegisterOwnerResponse } from "@shared/auth/types/register-owner";
import type {
	StoreNameType,
	userInputType,
} from "@shared/auth/validations/register-owner";
import type {
	ErrorResponse,
	ValidationErrorResponse,
} from "@shared/common/types/errors";

export const postRegisterOwner = async (
	lineToken: string,
	userInput: userInputType,
	storeName: StoreNameType,
): Promise<RegisterOwnerResponse | ErrorResponse | ValidationErrorResponse> => {
	const payload = {
		userInput: userInput,
		storeInput: storeName,
	};

	// const payload = {
	// 	userInput: {
	// 		name: "トム",
	// 		role: "OWNER",
	// 		pictureUrl: "http://picture.com",
	// 	},
	// 	storeInput: storeName,
	// };

	const res = await fetch(`${API_URL}/api/auth/register-owner`, {
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
