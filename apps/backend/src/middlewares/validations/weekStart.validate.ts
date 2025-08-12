import { WeekStartParamValidate } from "@shared/api/common/validations/weekStartParam.js";
import type { NextFunction, Request, Response } from "express";

interface WeekStartRequest extends Request {
	weekStart: Date;
}

export const validateWeekStart = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const parsed = WeekStartParamValidate.parse(req.params);
		const weekStart = parsed.weekStart;
		(req as WeekStartRequest).weekStart = new Date(weekStart);
		next();
	} catch (error) {
		res.status(400).json({ ok: false, message: "Invalid parameter weekStart" });
	}
};
