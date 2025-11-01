import type {
	ErrorResponse,
	ValidationErrorResponse,
} from "@shared/api/common/types/errors.js";
import type { AIShiftAdjustResponse } from "@shared/api/shift/ai/types/post-adjust.js";
import { AiShiftAdjustValidate } from "@shared/api/shift/ai/validations/post-adjust.js";
import type { Request, Response } from "express";
import { getStaffPreferencesByStoreId } from "../../../../repositories/staffPreference.js";
import { toStaffPreferencesDTO } from "../../../staffPreference/toDTO.js";
import { getAIShiftAdjustment } from "./service.js";
import { testResponseService } from "./test.service.js";
import { mergePrefsIntoSubmissions } from "./utils/mergePreferenceIntoSubmissions.js";

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

		const {
			templateShift,
			submissions,
			currentAssignments,
			memberProfiles,
			constraints,
		} = parsed.data;

		if (
			!templateShift ||
			!submissions ||
			!currentAssignments ||
			!memberProfiles
		) {
			res.status(400).json({
				ok: false,
				message: "必須データが不足しています。",
			});
			return;
		}

		if (process.env.NODE_ENV === "test") {
			return testResponseService(res);
		}

		const staffPreferences = await getStaffPreferencesByStoreId(auth.sid);
		if (!staffPreferences) {
			res.status(403).json({
				ok: false,
				message: "AIシフト調整機能が有効になっていません。",
			});
			return;
		}
		const staffPreferencesDTO = toStaffPreferencesDTO(staffPreferences);

		const mergetPreferencesIntoSubmissions = mergePrefsIntoSubmissions(
			templateShift,
			submissions,
			staffPreferencesDTO,
		);

		const result = await getAIShiftAdjustment({
			datas: {
				templateShift,
				submissions: mergetPreferencesIntoSubmissions.mergedSubmissions,
				currentAssignments,
				memberProfiles,
				constraints,
			},
		});

		res.status(200).json(result);
	} catch (error) {
		res.status(500).json({
			ok: false,
			message: error instanceof Error ? error.message : "internal server error",
		});
	}
};
