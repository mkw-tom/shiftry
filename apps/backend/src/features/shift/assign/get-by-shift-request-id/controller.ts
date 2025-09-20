import type { ErrorResponse } from "@shared/api/common/types/errors.js";
import type { ShiftsOfAssignType } from "@shared/api/common/types/json.js";
import type { GetAssignShiftResponse } from "@shared/api/shift/assign/types/get-by-shift-request-id.js";
import type { Request, Response } from "express";
import { getAssignShift } from "../../../../repositories/assingShift.repostory.js";
import { verifyUserStore } from "../../../common/authorization.service.js";

const getAssignShiftController = async (
	req: Request,
	res: Response<GetAssignShiftResponse | ErrorResponse>,
): Promise<void> => {
	try {
		const auth = req.auth;
		if (!auth?.uid || !auth?.sid) {
			res.status(401).json({ ok: false, message: "Unauthorized" });
			return;
		}
		const { shiftRequestId } = req.params;
		if (!shiftRequestId) {
			res
				.status(400)
				.json({ ok: false, message: "shiftRequestId is required" });
			return;
		}
		await verifyUserStore(auth.uid, auth.sid);

		const assignShift = await getAssignShift(shiftRequestId);
		if (!assignShift) {
			res.status(404).json({ ok: false, message: "assignShift is not found" });
			return;
		}

		const safeAssignShift = {
			...assignShift,
			shifts: assignShift.shifts as ShiftsOfAssignType,
		};

		res.status(200).json({ ok: true, assignShift: safeAssignShift });
	} catch (error) {
		console.error("Failed to get assign shift:", error);
		res.status(500).json({ ok: false, message: "Internal Server Error" });
	}
};

export default getAssignShiftController;
