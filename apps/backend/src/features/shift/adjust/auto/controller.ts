import type {
	ErrorResponse,
	ValidationErrorResponse,
} from "@shared/api/common/types/errors.js";
import type { AutoShiftAdjustResponse } from "@shared/api/shift/adjust/types/auto.js";
import { AutoShiftAdjustValidate } from "@shared/api/shift/adjust/validations/auto.js";
import type { Request, Response } from "express";
import { getStaffPreferencesByStoreId } from "../../../../repositories/staffPreference.js";
import { toStaffPreferencesDTO } from "../../../staffPreference/toDTO.js";
import { assignShiftsDeterministic } from "./engine/assigner.js";
import { mergePrefsIntoSubmissions } from "./mergePreferenceIntoSubmissions.js";

export const autoShiftAdjustController = async (
	req: Request,
	res: Response<
		AutoShiftAdjustResponse | ErrorResponse | ValidationErrorResponse
	>,
): Promise<void> => {
	try {
		const auth = req.auth;
		if (!auth?.uid || !auth?.sid) {
			res.status(401).json({ ok: false, message: "Unauthorized" });
			return;
		}

		const parsed = AutoShiftAdjustValidate.safeParse(req.body);
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

		const result = assignShiftsDeterministic({
			templateShift,
			submissions: mergetPreferencesIntoSubmissions.mergedSubmissions,
			currentAssignments,
			memberProfiles,
			constraints: {
				dailyMaxPerUser: 1,
				allowPartialOverlap: false,
				maximizeDistinctAssignments: true,
				dateFilter: constraints?.dateFilter ?? { mode: "ALL" },
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
