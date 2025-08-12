import type { Request, Response } from "express";

import type { ErrorResponse } from "@shared/api/common/types/errors.js";
import type { GetShiftRequestSpecificResponse } from "@shared/api/shift/request/types/get-by-week-start.js";
import { getShiftRequestSpecific } from "../../../../repositories/shiftRequest.repository.js";
import { verifyUserStore } from "../../../common/authorization.service.js";

const getShiftRequestSpecificController = async (
	req: Request,
	res: Response<GetShiftRequestSpecificResponse | ErrorResponse>,
): Promise<void> => {
	try {
		const userId = req.userId as string;
		const storeId = req.storeId as string;
		await verifyUserStore(userId, storeId);

		const weekStart = req.params.weekStart;
		const shiftRerquest = await getShiftRequestSpecific(storeId, weekStart);
		if (!shiftRerquest) {
			res.status(404).json({ ok: false, message: "Shift request not found" });
			return;
		}

		res.status(200).json({ ok: true, shiftRerquest });
	} catch (error) {
		console.error(error);
		res.status(500).json({ ok: false, message: "Internal Server Error" });
	}
};

export default getShiftRequestSpecificController;
