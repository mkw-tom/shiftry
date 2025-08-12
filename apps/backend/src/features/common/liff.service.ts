// features/common/line/service.ts
import { createRemoteJWKSet, jwtVerify } from "jose";
import { lineLoginChannel, lineMessageChannel } from "../../lib/env";

const JWKS = createRemoteJWKSet(
	new URL("https://api.line.me/oauth2/v2.1/certs"),
);

export type ChannelType = "utou" | "group" | "room";

export async function verifyIdToken(idToken: string) {
	const { payload } = await jwtVerify(idToken, JWKS, {
		issuer: "https://access.line.me",
		audience: lineLoginChannel.id, // 複数対応したければ Array も可
		clockTolerance: 5, // 秒: 端末時計ズレに少し寛容
	});
	return payload.sub as string; // LINE userId
}

export async function assertChannelValid(
	type: ChannelType,
	id?: string | null,
) {
	if (type === "utou") return;
	if (!id) throw { status: 400, message: "channelId required" };

	const ctrl = new AbortController();
	const timeout = setTimeout(() => ctrl.abort(), 5000);

	try {
		const r = await fetch(`https://api.line.me/v2/bot/${type}/${id}/summary`, {
			headers: { Authorization: `Bearer ${lineMessageChannel.accessToken}` },
			signal: ctrl.signal,
		});

		if (!r.ok) {
			const text = await r.text().catch(() => "");
			// 404: 不在/存在しない, 401/403: トークン不正 or 権限不足, 429: レート制限
			const status = [401, 403, 404, 429].includes(r.status) ? r.status : 502;
			throw { status, message: `LINE API ${r.status}: ${text || "failed"}` };
		}
	} catch (e) {
		if (
			typeof e === "object" &&
			e !== null &&
			"name" in e &&
			e.name === "AbortError"
		) {
			throw { status: 504, message: "LINE API timeout" };
		}
		throw e;
	} finally {
		clearTimeout(timeout);
	}
}
