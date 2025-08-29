import type {
	ErrorResponse,
	ValidationErrorResponse,
} from "@shared/api/common/types/errors.js";
import type { AbsDTO, PriDTO, WeekDay } from "@shared/api/shiftPosition/dto.js";
import type { GetShiftPositionsResponse } from "@shared/api/shiftPosition/types/get-by-store-id.js";
import type { Request, Response } from "express";
import { getShiftPositionsByStoreId } from "../../../repositories/ShiftPosition.js";
import { verifyUserStoreForOwnerAndManager } from "../../common/authorization.service.js";

const getShiftPosisiosnByStoreIdController = async (
	req: Request,
	res: Response<
		GetShiftPositionsResponse | ErrorResponse | ValidationErrorResponse
	>,
) => {
	try {
		const auth = req.auth;
		if (!auth?.uid || !auth?.sid) {
			res.status(401).json({ ok: false, message: "Unauthorized" });
			return;
		}
		await verifyUserStoreForOwnerAndManager(auth.uid, auth.sid);

		const shiftPositionsRaw = await getShiftPositionsByStoreId(auth.sid);
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

export default getShiftPosisiosnByStoreIdController;
