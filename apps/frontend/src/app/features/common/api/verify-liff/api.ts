import { API_URL } from "@/app/lib/env";
import type { VerifyLiffUserResponse } from "@shared/api/auth/types/liff-verify";
import type {
	ErrorResponse,
	ValidationErrorResponse,
} from "@shared/api/common/types/errors";

export const postVerifyLiff = async (
	idToken: string,
	channelId: string | undefined, // utou の場合は undefined を渡す
	channelType: "utou" | "group" | "room",
): Promise<
	VerifyLiffUserResponse | ErrorResponse | ValidationErrorResponse
> => {
	if (!idToken) throw new Error("idToken is not found");

	// ヘッダを動的に組み立てる（undefined の時はキー自体を付けない）
	const headers: Record<string, string> = {
		"Content-Type": "application/json",
		"x-id-token": idToken,
		"x-channel-type": channelType,
		...(channelId ? { "x-channel-id": channelId } : {}), // ← ここがミソ
	};

	const res = await fetch(`${API_URL}/api/auth/liff/verify`, {
		method: "POST",
		headers,
	});

	const data = (await res.json()) as
		| VerifyLiffUserResponse
		| ErrorResponse
		| ValidationErrorResponse;

	return data;
};
