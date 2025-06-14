import {
	NEXT_PUBLIC_LINE_AUTH_CHANNEL_ID,
	NEXT_PUBLIC_LINE_AUTH_REDIRECT_URI,
} from "./env";
import type { StateMode, StateRole } from "./types/line-auth";

export const generateLineLoginUrl = (role: StateRole, mode: StateMode) => {
	const state = `${role}:${mode}`;
	const base = "https://access.line.me/oauth2/v2.1/authorize";
	const params = new URLSearchParams({
		response_type: "code",
		client_id: NEXT_PUBLIC_LINE_AUTH_CHANNEL_ID,
		redirect_uri: NEXT_PUBLIC_LINE_AUTH_REDIRECT_URI,
		state: state, // ← ここに role を埋め込む！
		scope: "profile openid",
		nonce: crypto.randomUUID(),
	});
	return `${base}?${params.toString()}`;
};
