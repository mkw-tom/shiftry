import type { LineAuthServiceResponse } from "@shared/api/auth/types/line-auth";
import {
	LINE_AUTH_CHANNEL_ID,
	LINE_AUTH_CHANNEL_SECRET,
	LINE_AUTH_REDIRECT_URI,
} from "../../../lib/env";

const lineAuth = async (code: string): Promise<LineAuthServiceResponse> => {
	const params = new URLSearchParams();
	params.append("grant_type", "authorization_code");
	params.append("code", code);
	params.append("redirect_uri", LINE_AUTH_REDIRECT_URI);
	params.append("client_id", LINE_AUTH_CHANNEL_ID);
	params.append("client_secret", LINE_AUTH_CHANNEL_SECRET);

	const tokenRes = await fetch("https://api.line.me/oauth2/v2.1/token", {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body: params,
	});
	if (!tokenRes.ok) {
		throw new Error("トークン取得失敗");
	}

	const tokenData = await tokenRes.json();
	if (!tokenData.id_token) {
		throw new Error("LINEトークンの取得に失敗しました");
	}

	const userInfoRes = await fetch("https://api.line.me/oauth2/v2.1/verify", {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body: new URLSearchParams({
			id_token: tokenData.id_token,
			client_id: LINE_AUTH_CHANNEL_ID,
		}),
	});
	if (!userInfoRes.ok) {
		throw new Error("LINEユーザー情報の取得に失敗");
	}

	const userInfo = await userInfoRes.json();
	const userId = userInfo.sub;

	const profileRes = await fetch("https://api.line.me/v2/profile", {
		method: "GET",
		headers: {
			Authorization: `Bearer ${tokenData.access_token}`,
		},
	});

	if (!profileRes.ok) throw new Error("プロフィール取得に失敗");

	const profile = await profileRes.json();

	return {
		userId,
		name: profile.displayName,
		pictureUrl: profile.pictureUrl,
	};
};

export default lineAuth;
