import { API_URL } from "@/app/lib/env";
import type {
	ErrorResponse,
	ValidationErrorResponse,
} from "@shared/api/common/types/errors";
import type { CreateShiftAiResponse } from "@shared/api/shift/ai/types/post-create";
import type { CreateShiftValidateType } from "@shared/api/shift/ai/validations/post-create";

export const generateShiftWithAI = async ({
	userToken,
	storeToken,
	formData,
}: {
	userToken: string;
	storeToken: string;
	formData: CreateShiftValidateType;
}): Promise<
	CreateShiftAiResponse | ErrorResponse | ValidationErrorResponse
> => {
	if (!userToken) {
		throw new Error("code is not found");
	}
	if (!storeToken) {
		throw new Error("code is not found");
	}
	if (!formData) {
		throw new Error("shiftRequestId is not found");
	}
	const res = await fetch(`${API_URL}/api/shift/ai/create`, {
		method: "POST",
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
