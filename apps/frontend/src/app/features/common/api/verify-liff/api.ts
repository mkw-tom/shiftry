import { API_URL } from "@/app/lib/env";
import type { VerifyLiffUserResponse } from "@shared/api/auth/types/liff-verify";
import type {
	ErrorResponse,
	ValidationErrorResponse,
} from "@shared/api/common/types/errors";

export const postVerifyLiff = async (
	idToken: string,
	channelId: string,
	channelType: "utou" | "group" | "room",
): Promise<
	VerifyLiffUserResponse | ErrorResponse | ValidationErrorResponse
> => {
	if (!idToken) throw new Error("idToken is not found");

	const res = await fetch(`${API_URL}/api/auth/liff/verify`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"x-id-token": idToken,
			"x-channel-id": channelId,
			"x-channel-type": channelType,
		},
	});

	// ここで await ＋ ジェネリックを噛ませる
	const data = (await res.json()) as
		| VerifyLiffUserResponse
		| ErrorResponse
		| ValidationErrorResponse;
	return data;
};
