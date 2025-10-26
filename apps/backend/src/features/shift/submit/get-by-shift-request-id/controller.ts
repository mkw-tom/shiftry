import type { Request, Response } from "express";

import type { ErrorResponse } from "@shared/api/common/types/errors.js";
import type { GetSubmittedShiftsSpecificResponse } from "@shared/api/shift/submit/types/get-by-shift-request-id.js";
import type { SubmittedDataType } from "@shared/api/shift/submit/validations/put.js";
import { getSubmittedShiftsSpecific } from "../../../../repositories/submittedShift.repository.js";
import { verifyUserStore } from "../../../common/authorization.service.js";

const getSubmittedShiftsSpesificController = async (
	req: Request,
	res: Response<GetSubmittedShiftsSpecificResponse | ErrorResponse>,
): Promise<void> => {
	try {
		const auth = req.auth;
		if (!auth?.uid || !auth?.sid) {
			res.status(401).json({ ok: false, message: "Unauthorized" });
			return;
		}

		await verifyUserStore(auth.uid, auth.sid);

		const { shiftRequestId } = req.params;
		if (!shiftRequestId) {
			res
				.status(400)
				.json({ ok: false, message: "shiftRequestId is required" });
			return;
		}

		const submittedShiftsRaw = await getSubmittedShiftsSpecific(shiftRequestId);
		if (submittedShiftsRaw.length === 0) {
			res.status(200).json({ ok: true, submittedShifts: [] });
			return;
		}

		const submittedShifts = submittedShiftsRaw.map((shift) => ({
			...shift,
			shifts:
				typeof shift.shifts === "object" && shift.shifts !== null
					? (shift.shifts as SubmittedDataType)
					: {},
		}));

		res.status(200).json({ ok: true, submittedShifts });
	} catch (error) {
		console.error("Failed to get weekly submitted shifts:", error);
		res.status(500).json({ ok: false, message: "Internal Server Error" });
	}
};

export default getSubmittedShiftsSpesificController;
