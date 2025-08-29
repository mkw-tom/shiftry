import type {
	ErrorResponse,
	ValidationErrorResponse,
} from "@shared/api/common/types/errors.js";
import type { AbsDTO, PriDTO, WeekDay } from "@shared/api/shiftPosition/dto.js";
import type { BulkUpsertShiftPositionsResponse } from "@shared/api/shiftPosition/types/put-bulk.js";
import { bulkUpsertShiftPositionValidate } from "@shared/api/shiftPosition/validations/put-bulk.js";
import type { Request, Response } from "express";
import { bulkUpsertShiftPositions } from "../../../repositories/ShiftPosition.js";
import { verifyUserStoreForOwnerAndManager } from "../../common/authorization.service.js";

const bulkUpsertShiftPosisionsController = async (
	req: Request,
	res: Response<
		BulkUpsertShiftPositionsResponse | ErrorResponse | ValidationErrorResponse
	>,
) => {
	try {
		const auth = req.auth;
		if (!auth?.uid || !auth?.sid) {
			res.status(401).json({ ok: false, message: "Unauthorized" });
			return;
		}
		const parsed = bulkUpsertShiftPositionValidate.safeParse(req.body);
		if (!parsed.success) {
			console.log(
				"bulkUpsertShiftPositionValidate error:",
				parsed.error.errors,
			);
			res.status(400).json({
				ok: false,
				message: "Invalid request value",
				errors: parsed.error.errors,
			});
			return;
		}

		await verifyUserStoreForOwnerAndManager(auth.uid, auth.sid);

		const shiftPositionsRaw = await bulkUpsertShiftPositions(
			auth.sid,
			parsed.data,
		);
		const shiftPositions = shiftPositionsRaw.map((pos) => ({
			...pos,
			weeks: pos.weeks as WeekDay[],
			absolute: Array.isArray(pos.absolute) ? (pos.absolute as AbsDTO[]) : [],
			priority: Array.isArray(pos.priority) ? (pos.priority as PriDTO[]) : [],
		}));

		res.json({ ok: true, shiftPositions });
	} catch (error) {
		console.error("Failed to get job roles:", error);
		res.status(500).json({ ok: false, message: "Internal Server Error" });
	}
};

export default bulkUpsertShiftPosisionsController;
