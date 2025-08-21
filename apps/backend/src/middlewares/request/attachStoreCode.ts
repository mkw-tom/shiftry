import { StoreCodeHeaderValidate } from "@shared/api/store/validations/connect-line-group.js";
import type { NextFunction, Request, Response } from "express";

export const attachStoreCode = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		// Zodでパース
		const result = StoreCodeHeaderValidate.safeParse({
			"x-store-code": req.headers["x-store-code"],
		});

		if (!result.success) {
			return void res.status(400).json({
				message: "Missing or invalid storeCode",
				errors: result.error.format(),
			});
		}

		// 正常なら storeCode を型安全に取り出し
		req.storeCode = result.data["x-store-code"];
		next();
	} catch (err) {
		console.error("attachStoreCode error:", err);
		res
			.status(500)
			.json({ message: "Unexpected error while attaching storeCode" });
	}
};
