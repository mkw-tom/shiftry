import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const attachStoreId = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const storeId_token = req.headers["x-store-id"];
		if (!storeId_token || typeof storeId_token !== "string") {
			res.status(400).json({ message: "Missing or invalid storeId" });
			return;
		}

		if (process.env.TEST_MODE === "true") {
			req.storeId = storeId_token;
			return next();
		}

		const decoded = jwt.verify(
			storeId_token,
			process.env.JWT_SECRET as string,
		) as {
			storeId: string;
		};

		if (!decoded.storeId) {
			res.status(400).json({ message: "Invalid token payload" });
			return;
		}

		req.storeId = decoded.storeId;
		next();
	} catch (err) {
		console.error("attachStoreId error:", err);
		res
			.status(401)
			.json({ message: "Unexpected error while attaching storeId" });
	}
};
