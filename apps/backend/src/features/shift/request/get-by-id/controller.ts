import type { Request, Response } from "express";

import type { ErrorResponse } from "@shared/api/common/types/errors.js";
import type { RequestsType } from "@shared/api/common/types/json.js";
import type { GetShiftRequestSpecificResponse } from "@shared/api/shift/request/types/get-by-id.js";
import {
	getShiftRequestById,
	getShiftRequestSpecific,
} from "../../../../repositories/shiftRequest.repository.js";
import { verifyUserStore } from "../../../common/authorization.service.js";

const getShiftRequestSpecificController = async (
	req: Request,
	res: Response<GetShiftRequestSpecificResponse | ErrorResponse>,
): Promise<void> => {
	try {
		const auth = req.auth;
		const shiftRequestId = req.params.shiftRequestId;

		if (!auth?.uid || !auth?.sid) {
			res.status(401).json({ ok: false, message: "Unauthorized" });
			return;
		}

		await verifyUserStore(auth.uid, auth.sid);

		const shiftRequestRaw = await getShiftRequestById(shiftRequestId);
		if (!shiftRequestRaw) {
			res.status(404).json({ ok: false, message: "Shift request not found" });
			return;
		}
		const shiftRequest = {
			...shiftRequestRaw,
			requests: shiftRequestRaw.requests as RequestsType,
		};

		res.status(200).json({ ok: true, shiftRequest });
	} catch (error) {
		console.error(error);
		res.status(500).json({ ok: false, message: "Internal Server Error" });
	}
};

export default getShiftRequestSpecificController;
