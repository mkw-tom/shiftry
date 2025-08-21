import type { NextFunction, Request, Response } from "express";

export const attachStoreCode = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const storeCode = req.headers["x-store-code"];
		if (!storeCode || typeof storeCode !== "string") {
			res.status(400).json({ message: "Missing or invalid storeId" });
			return;
		}

		req.storeCode = storeCode;
		next();
	} catch (err) {
		console.error("attachStoreCode error:", err);
		res
			.status(401)
			.json({ message: "Unexpected error while attaching StoreCode" });
	}
};
