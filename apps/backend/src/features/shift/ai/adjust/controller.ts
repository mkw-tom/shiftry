import type {
	ErrorResponse,
	ValidationErrorResponse,
} from "@shared/api/common/types/errors.js";
import type { AIShiftAdjustResponse } from "@shared/api/shift/ai/types/post-adjust.js";
import { AiShiftAdjustValidate } from "@shared/api/shift/ai/validations/post-adjust.js";
import type { Request, Response } from "express";
import { getAIShiftAdjustment } from "./service.js";

export const aiShiftAdjustController = async (
	req: Request,
	res: Response<
		ValidationErrorResponse | ErrorResponse | AIShiftAdjustResponse
	>,
): Promise<void> => {
	try {
		const auth = req.auth;
		if (!auth?.uid || !auth?.sid) {
			res.status(401).json({ ok: false, message: "Unauthorized" });
			return;
		}

		const parsed = AiShiftAdjustValidate.safeParse(req.body);
		if (!parsed.success) {
			res.status(400).json({
				ok: false,
				message: "invalid request value",
				errors: parsed.error.errors,
			});
			return;
		}
		const { templateShift, submissions, currentAssignments, constraints } =
			parsed.data;

		if (!templateShift || !submissions || !currentAssignments) {
			res.status(400).json({
				ok: false,
				message: "必須データが不足しています。",
			});
			return;
		}

		const result = await getAIShiftAdjustment({
			templateShift,
			submissions,
			currentAssignments,
			constraints,
		});

		res.status(200).json(result);
	} catch (error) {
		res.status(500).json({ ok: false, message: "Internal Server Error" });
	}
};
