import { shiftRequestIdParamValidate } from "@shared/api/common/validations/shiftRequestIdParam.js";
import type { NextFunction, Request, Response } from "express";

interface ShiftRequestIdRequest extends Request {
	shiftRequestId: string;
}

export const validateShiftRequestId = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const parsed = shiftRequestIdParamValidate.parse(req.params);

		const shiftRequestId = parsed.shiftRequestId;
		(req as ShiftRequestIdRequest).shiftRequestId = shiftRequestId;
		next();
	} catch (error) {
		res
			.status(400)
			.json({ ok: false, message: "Invalid parameter shiftRequestId" });
	}
};
