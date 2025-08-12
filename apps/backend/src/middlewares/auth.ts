import type { NextFunction, Request, Response } from "express"; // ← ここをユーティリティ呼びに
import { tryVerifyAppJwt } from "../utils/jwt";
// SECRETはappJwt.ts側で集中管理するのでこのファイルでは触らない

function parseBearer(header?: string): string | null {
	if (!header) return null;
	const m = header.match(/^Bearer\s+(.+)$/i);
	return m ? m[1] : null;
}

export function allowAnon(req: Request, res: Response, next: NextFunction) {
	const token = parseBearer(req.headers.authorization);
	if (!token) {
		req.auth = {};
		next();
		return;
	}

	const v = tryVerifyAppJwt(token);
	if (v.ok) req.auth = v.payload;
	else req.auth = {}; // 壊れてたら匿名扱い
	next();
}

export function requireUser(req: Request, res: Response, next: NextFunction) {
	const token = parseBearer(req.headers.authorization);
	if (!token) {
		res.status(401).json({ message: "Missing token" });
		return;
	}

	const v = tryVerifyAppJwt(token);
	if (!v.ok) {
		const msg = v.reason === "expired" ? "Expired token" : "Invalid token";
		res.status(401).json({ message: msg });
		return;
	}
	if (!v.payload.uid) {
		res.status(403).json({ message: "User consent required" });
		return;
	}
	req.auth = v.payload;
	next();
}
