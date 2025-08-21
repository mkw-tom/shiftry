import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { jwtSettings } from "../../lib/env.js";

export const attachGroupId = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const groupId_token = req.headers["x-group-id"];
		if (!groupId_token || typeof groupId_token !== "string") {
			res.status(400).json({ message: "Missing or invalid groupId" });
			return;
		}

		if (process.env.TEST_MODE === "true") {
			req.groupId = groupId_token;
			return next();
		}

		const decoded = jwt.verify(groupId_token, jwtSettings.secret) as {
			groupId: string;
		};

		if (!decoded.groupId) {
			res.status(400).json({ message: "Invalid token payload" });
			return;
		}

		req.groupId = decoded.groupId;
		next();
	} catch (err) {
		console.error("attachGroupId error:", err);
		res
			.status(401)
			.json({ message: "Unexpected error while attaching groupId" });
	}
};
