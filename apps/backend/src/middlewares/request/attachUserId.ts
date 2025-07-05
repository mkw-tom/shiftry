import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const attachUserId = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const authHeader = req.headers.authorization as string;
		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			res
				.status(400)
				.json({ message: "Missing or invalid Authorization header" });
			return;
		}

		const token = authHeader.split(" ")[1];

		if (process.env.TEST_MODE === "true") {
			req.userId = token;
			return next();
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
			userId: string;
		};

		req.userId = decoded.userId;
		next();
	} catch (err) {
		console.error("JWT decode error:", err);
		res
			.status(401)
			.json({ message: "Unexpected error while attaching userId" });
	}
};
