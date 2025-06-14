import { UserIdParamValidate } from "@shared/common/validations/userIdParam";
import type { NextFunction, Request, Response } from "express";

interface UserIdRequest extends Request {
	userId: string;
}

export const validateUserId = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const parsed = UserIdParamValidate.parse(req.params);

		const userId = parsed.userId;
		(req as UserIdRequest).userId = userId;
		next();
	} catch (error) {
		res.status(400).json({ ok: false, message: "Invalid parameter userId" });
	}
};
