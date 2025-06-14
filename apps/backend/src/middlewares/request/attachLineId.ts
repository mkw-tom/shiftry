import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const attachLineId = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const lineId_token = req.headers["x-line-id"];
		if (!lineId_token || typeof lineId_token !== "string") {
			res.status(400).json({ message: "Missing or invalid lineId" });
			return;
		}

		if (process.env.TEST_MODE === "true") {
			req.lineId = lineId_token;
			return next();
		}

		const decoded = jwt.verify(
			lineId_token,
			process.env.JWT_SECRET as string,
		) as {
			lineId: string;
		};

		if (!decoded.lineId) {
			res.status(400).json({ message: "Invalid token payload" });
			return;
		}

		req.lineId = decoded.lineId;
		next();
	} catch (err) {
		console.error("attachlineId error:", err);
		res
			.status(401)
			.json({ message: "Unexpected error while attaching lineId" });
	}
};
