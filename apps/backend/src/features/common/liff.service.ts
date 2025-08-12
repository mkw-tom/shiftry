// features/common/line/service.ts
import {
	createRemoteJWKSet,
	decodeJwt,
	decodeProtectedHeader,
	jwtVerify,
} from "jose";
import { lineLoginChannel, lineMessageChannel } from "../../lib/env.js";

const JWKS = createRemoteJWKSet(
	new URL("https://api.line.me/oauth2/v2.1/certs"),
);

export type ChannelType = "utou" | "group" | "room";

export async function verifyIdToken(idToken: string) {
	const { alg } = decodeProtectedHeader(idToken);

	if (process.env.TEST_MODE === "true") {
		const secret = new TextEncoder().encode(
			process.env.TEST_IDTOKEN_HS256_SECRET,
		);
		const { payload } = await jwtVerify(idToken, secret, {
			algorithms: ["HS256"],
			audience: lineLoginChannel.id,
			issuer: "https://access.line.me",
		});
		return payload.sub as string;
	}
	if (alg === "RS256") {
		const { payload } = await jwtVerify(idToken, JWKS, {
			issuer: "https://access.line.me",
			audience: lineLoginChannel.id,
		});
		return payload.sub as string;
	}

	// ★ 開発用フォールバック（.env で明示的に許可した場合のみ）

	throw new Error(
		`Unsupported alg: ${alg}. Use real LIFF idToken (RS256) or enable HS256 test.`,
	);
}
export async function assertChannelValid(
	type: ChannelType,
	id?: string | null,
) {
	if (type === "utou") return;

	if (!id) throw { status: 400, message: "channelId required" };

	// ★ テストモード時はバリデーションスキップ
	if (process.env.TEST_MODE === "true") {
		console.warn(`[TEST_MODE] Skipping channel validation for ${type}:${id}`);
		return;
	}

	const ctrl = new AbortController();
	const timeout = setTimeout(() => ctrl.abort(), 5000);

	try {
		const r = await fetch(`https://api.line.me/v2/bot/${type}/${id}/summary`, {
			headers: { Authorization: `Bearer ${lineMessageChannel.accessToken}` },
			signal: ctrl.signal,
		});

		if (!r.ok) {
			const text = await r.text().catch(() => "");
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
