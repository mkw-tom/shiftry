import type { NextFunction, Request, Response } from "express";

export function attachChannel(req: Request, res: Response, next: NextFunction) {
	try {
		const id = req.header("x-channel-id");
		const type = (req.header("x-channel-type") || "").toLowerCase() as
			| "group"
			| "room"
			| "utou";

		// 必須/整合チェック
		if (!type) {
			res.status(400).json({ message: "X-Channel-Type required" });
			return;
		}

		if (type !== "group" && type !== "room" && type !== "utou") {
			res.status(400).json({ message: "Invalid X-Channel-Type" });
			return;
		}
		if (type !== "utou" && !id) {
			// group/room は必須
			res.status(400).json({ message: "X-Channel-Id required for group/room" });
			return;
		}

		// Nodeのヘッダーは大小区別なし。最小のバリデーションだけ（長さなど）
		if (id && id.length < 5) {
			res.status(400).json({ message: "Invalid X-Channel-Id" });
			return;
		}

		req.channel = { id: id ?? null, type };
		next();
	} catch (error) {
		console.error("attachChannel error:", error);
		res
			.status(500)
			.json({ message: "Unexpected error while attaching channel" });
	}
}
