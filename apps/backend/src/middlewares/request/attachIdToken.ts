import type { NextFunction, Request, Response } from "express";

const jwtLike = /^[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+$/;

export function attachIdToken(req: Request, res: Response, next: NextFunction) {
	try {
		const idToken = req.header("x-id-token");
		// 必須/整合チェック
		if (!idToken || typeof idToken !== "string") {
			res.status(400).json({ message: "Missing or invalid x-id-token" });
			return;
		}

		if (!jwtLike.test(idToken)) {
			res.status(400).json({ message: "Invalid X-Id-Token format" });
			return;
		}

		req.idToken = idToken;
		next();
	} catch (error) {
		console.error("attachIdToken error:", error);
		res
			.status(401)
			.json({ message: "Unexpected error while attaching idToken" });
	}
}
