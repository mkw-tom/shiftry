import type {
	ErrorResponse,
	ValidationErrorResponse,
} from "@shared/api/common/types/errors.js";
import type { AIShiftAdjustResponse } from "@shared/api/shift/ai/types/post-adjust.js";
import { AiShiftAdjustValidate } from "@shared/api/shift/ai/validations/post-adjust.js";
import type { StaffPreferenceDTO } from "@shared/api/staffPreference/dto.js";
import { type Request, type Response, response } from "express";
import {
	getStaffPreference,
	getStaffPreferencesByStoreId,
} from "../../../../repositories/staffPreference.js";
import { toStaffPreferencesDTO } from "../../../staffPreference/toDTO.js";
import { getAIShiftAdjustment } from "./service.js";
import { testResponseService } from "./test.service.js";
import { mergePrefsIntoSubmissions } from "./utils/mergePreferenceIntoSubmissions.js";

export const aiShiftAdjustController = async (
	req: Request,
	// res: Response<
	// 	ValidationErrorResponse | ErrorResponse | AIShiftAdjustResponse
	// >,
	res: Response,
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

		// const staffPreferences = await getStaffPreferencesByStoreId(auth.sid);
		// if (!staffPreferences) {
		// 	res.status(403).json({
		// 		ok: false,
		// 		message: "AIシフト調整機能が有効になっていません。",
		// 	});
		// 	return;
		// }
		// const staffPreferencesDTO = toStaffPreferencesDTO(staffPreferences);

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

		// if (process.env.NODE_ENV === "test") {
		//   return testResponseService(res);
		// }

		// const staffPreferencesDTO: Pick<
		// 	StaffPreferenceDTO,
		// 	"userId" | "weekMax" | "weekMin" | "weeklyAvailability" | "note"
		// >[] = [
		// 	{
		// 		userId: "user_001",
		// 		// storeId: "shop_123",
		// 		weekMin: 3,
		// 		weekMax: 5,
		// 		weeklyAvailability: {
		// 			mon: "09:00-13:00",
		// 			tue: "anytime",
		// 			wed: "09:00-12:00",
		// 			thu: "18:00-22:00",
		// 			fri: "anytime",
		// 			sat: "10:00-12:00",
		// 			sun: "09:00-12:00",
		// 		},
		// 		note: "午前〜昼が得意",
		// 	},
		// 	{
		// 		userId: "user_002",
		// 		// storeId: "shop_123",
		// 		weekMin: 3,
		// 		weekMax: 5,
		// 		weeklyAvailability: {
		// 			mon: "18:00-23:00",
		// 			tue: "18:00-23:00",
		// 			wed: "anytime",
		// 			fri: "18:00-23:00",
		// 			sat: "18:00-22:00",
		// 			sun: "12:00-16:00",
		// 		},
		// 		note: "夜型",
		// 	},
		// 	{
		// 		userId: "user_003",
		// 		// storeId: "shop_123",
		// 		weekMin: 2,
		// 		weekMax: 4,
		// 		weeklyAvailability: {
		// 			tue: "09:00-12:00",
		// 			wed: "anytime",
		// 			fri: "09:00-12:00",
		// 		},
		// 		note: "短時間シフト優先",
		// 	},
		// 	{
		// 		userId: "user_004",
		// 		// storeId: "shop_123",
		// 		weekMin: 2,
		// 		weekMax: 4,
		// 		weeklyAvailability: {
		// 			mon: "05:00-08:30",
		// 			wed: "08:00-10:00",
		// 			thu: "05:00-08:30",
		// 			sat: "10:00-14:00",
		// 		},
		// 		note: "早朝シフト可",
		// 	},
		// 	{
		// 		userId: "user_005",
		// 		// storeId: "shop_123",
		// 		weekMin: 3,
		// 		weekMax: 5,
		// 		weeklyAvailability: {
		// 			mon: "06:00-08:00",
		// 			tue: "09:00-13:00",
		// 			thu: "anytime",
		// 			fri: "12:00-15:00",
		// 			sun: "09:00-12:00",
		// 		},
		// 		note: "",
		// 	},
		// 	{
		// 		userId: "user_006",
		// 		// storeId: "shop_123",
		// 		weekMin: 3,
		// 		weekMax: 5,
		// 		weeklyAvailability: {
		// 			mon: "05:00-09:00",
		// 			tue: "06:00-09:00",
		// 			thu: "05:00-08:30",
		// 			fri: "06:00-10:00",
		// 			sat: "08:00-12:00",
		// 		},
		// 		note: "朝のみ",
		// 	},
		// 	{
		// 		userId: "user_007",
		// 		// storeId: "shop_123",
		// 		weekMin: 2,
		// 		weekMax: 3,
		// 		weeklyAvailability: {
		// 			sat: "anytime",
		// 			sun: "anytime",
		// 		},
		// 		note: "土日中心",
		// 	},
		// 	{
		// 		userId: "user_008",
		// 		// storeId: "shop_123",
		// 		weekMin: 3,
		// 		weekMax: 4,
		// 		weeklyAvailability: {
		// 			mon: "18:00-22:00",
		// 			tue: "anytime",
		// 			thu: "18:00-21:00",
		// 			sat: "12:00-16:00",
		// 		},
		// 		note: "",
		// 	},
		// ];

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
		// res.status(200).json({ submissions, staffPreferencesDTO, data : mergetPreferencesIntoSubmissions})

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
		res.status(500).json({ ok: false, message: "Internal Server Error" });
	}
};
