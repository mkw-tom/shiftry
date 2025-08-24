import { API_URL } from "@/app/lib/env";
import type {
	ErrorResponse,
	ValidationErrorResponse,
} from "@shared/api/common/types/errors";
import type { LineMessageAPIResponse } from "@shared/api/webhook/line/types";
import type { RequestShiftMessageType } from "@shared/api/webhook/line/validatioins";

export const sendShiftRequest = async ({
	jwt,
	sendData,
}: {
	jwt: string;
	sendData: RequestShiftMessageType;
}): Promise<
	LineMessageAPIResponse | ErrorResponse | ValidationErrorResponse
> => {
	if (!jwt) {
		throw new Error("jwt token is required");
	}
	const res = await fetch(`${API_URL}/webhook/line/request-shift`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${jwt}`,
		},
		body: JSON.stringify(sendData),
	});

	const data = await res.json();

	return data;
};
