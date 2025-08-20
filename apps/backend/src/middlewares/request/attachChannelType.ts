import type { NextFunction, Request, Response } from "express";

export function attachChannelType(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	try {
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

		req.channelType = type;
		next();
	} catch (error) {
		console.error("attachChannel error:", error);
		res
			.status(500)
			.json({ message: "Unexpected error while attaching channel" });
	}
}
