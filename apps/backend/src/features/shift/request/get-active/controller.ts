import type { ErrorResponse } from "@shared/api/common/types/errors";
import type { GetShiftRequestResponse } from "@shared/api/shift/request/types/get";
import type { Request, Response } from "express";
import { getActiveShiftRequests } from "../../../../repositories/shiftRequest.repository";
import { verifyUserStore } from "../../../common/authorization.service";

const getAcvtiveShiftRequestsController = async (
	req: Request,
	res: Response<GetShiftRequestResponse | ErrorResponse>,
): Promise<void> => {
	try {
		const userId = req.userId as string;
		const storeId = req.storeId as string;
		await verifyUserStore(userId, storeId);

		const shiftRequests = await getActiveShiftRequests(storeId);

		res.status(200).json({ ok: true, shiftRequests });
	} catch (error) {
		console.error(error);
		res.status(500).json({ ok: false, message: "Internal Server Error" });
	}
};

export default getAcvtiveShiftRequestsController;
