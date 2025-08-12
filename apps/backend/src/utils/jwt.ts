import type { UserRole } from "@shared/api/common/types/prisma.js";
// src/utils/appJwt.ts
import jwt, {
	type JwtPayload,
	type SignOptions,
	type VerifyOptions,
} from "jsonwebtoken";
import { jwtSettings } from "../lib/env.js";

const SECRET = jwtSettings.secret;
const TTL_MIN = Number(jwtSettings.expiresIn || 15);

if (!SECRET || SECRET.length < 32) {
	// 本番は throw でもOK
	console.warn(
		"[appJwt] APP_JWT_SECRET is too short. Use >=32 chars random secret.",
	);
}

export type AppJwtPayload = {
	uid?: string; // 登録済みなら入る
	sid?: string; // 店舗コンテキストがあるなら入れる（任意）
	role?: UserRole; // UIヒント用途のみ。認可はDBで判定！
	iss?: string; // 追加メタ
	aud?: string;
	sub?: string; // 通常は uid を sub に入れるのもアリ
	iat?: number;
	exp?: number;
};

const signOpts: SignOptions = {
	expiresIn: `${TTL_MIN}m`,
	algorithm: "HS256", // ★ アルゴリズム固定
	issuer: "shiftry-app",
	audience: "shiftry-client",
};

const verifyOpts: VerifyOptions = {
	algorithms: ["HS256"], // ★ 固定
	issuer: "shiftry-app",
	audience: "shiftry-client",
	clockTolerance: 5, // 秒。端末時計ズレに少し寛容
};

export function signAppJwt(payload: {
	uid?: string;
	sid?: string;
	role?: UserRole;
}) {
	// subを付けたい場合（uidがある時のみ）
	const opt: SignOptions = payload.uid
		? { ...signOpts, subject: payload.uid }
		: signOpts;
	return jwt.sign(payload as JwtPayload, SECRET, opt);
}

// 失敗を例外にせず結果で返すユーティリティ（使いやすい）
export function tryVerifyAppJwt(
	token: string,
):
	| { ok: true; payload: AppJwtPayload }
	| { ok: false; reason: "missing" | "invalid" | "expired" } {
	if (!token) return { ok: false, reason: "missing" };
	try {
		const decoded = jwt.verify(token, SECRET, verifyOpts) as AppJwtPayload;
		return { ok: true, payload: decoded };
	} catch (e) {
		if ((e as Error)?.name === "TokenExpiredError")
			return { ok: false, reason: "expired" };
		return { ok: false, reason: "invalid" };
	}
}

// 例外を投げる版（既存ミドルウェア互換）
export function verifyAppJwt(token: string): AppJwtPayload {
	return jwt.verify(token, SECRET, verifyOpts) as AppJwtPayload;
}
