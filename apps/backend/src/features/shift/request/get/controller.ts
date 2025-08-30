import type { ErrorResponse } from "@shared/api/common/types/errors.js";
import type { RequestsType } from "@shared/api/common/types/json.js";
import type { GetShiftRequestResponse } from "@shared/api/shift/request/types/get.js";
import type { Request, Response } from "express";
import { getShiftRequestByStoreId } from "../../../../repositories/shiftRequest.repository.js";
import { verifyUserStore } from "../../../common/authorization.service.js";

const getShiftRequestsController = async (
	req: Request,
	res: Response<GetShiftRequestResponse | ErrorResponse>,
): Promise<void> => {
	try {
		const userId = req.userId as string;
		const storeId = req.storeId as string;
		await verifyUserStore(userId, storeId);

		const shiftRequestsRaw = await getShiftRequestByStoreId(storeId);

		const shiftRequests = shiftRequestsRaw.map((req) => ({
			...req,
			requests: req.requests === null ? {} : (req.requests as RequestsType),
		}));

		res.status(200).json({ ok: true, shiftRequests });
	} catch (error) {
		console.error(error);
		res.status(500).json({ ok: false, message: "Internal Server Error" });
	}
};

export default getShiftRequestsController;
