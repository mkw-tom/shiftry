import type { ErrorResponse } from "@shared/common/types/errors";
import type { GetShiftRequestResponse } from "@shared/shift/request/types/get";
import type { Request, Response } from "express";
import { getShiftRequestByStoreId } from "../../../../repositories/shiftRequest.repository";
import { verifyUserStore } from "../../../common/authorization.service";

const getShiftRequestsController = async (
	req: Request,
	res: Response<GetShiftRequestResponse | ErrorResponse>,
): Promise<void> => {
	try {
		const userId = req.userId as string;
		const storeId = req.storeId as string;
		await verifyUserStore(userId, storeId);

		const shiftRequests = await getShiftRequestByStoreId(storeId);
		if (shiftRequests.length === 0) {
			res
				.status(404)
				.json({ ok: false, message: "shift requests is not found" });
			return;
		}

		res.status(200).json({ ok: true, shiftRequests });
	} catch (error) {
		console.error(error);
		res.status(500).json({ ok: false, message: "Internal Server Error" });
	}
};

export default getShiftRequestsController;
