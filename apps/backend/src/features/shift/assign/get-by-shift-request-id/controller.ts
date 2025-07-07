import type { ErrorResponse } from "@shared/api/common/types/errors";
import type { GetAssigShiftResponse } from "@shared/api/shift/assign/types/get-by-shift-request-id";
import type { Request, Response } from "express";
import { getAssignShift } from "../../../../repositories/assingShift.repostory";
import { verifyUserStore } from "../../../common/authorization.service";

const getAssignShiftController = async (
	req: Request,
	res: Response<GetAssigShiftResponse | ErrorResponse>,
): Promise<void> => {
	try {
		const userId = req.userId as string;
		const storeId = req.storeId as string;
		await verifyUserStore(userId, storeId);

		const { shiftRequestId } = req.params;

		const assignShift = await getAssignShift(shiftRequestId);
		if (!assignShift) {
			res.status(404).json({ ok: false, message: "assignShift is not found" });
			return;
		}

		res.status(200).json({ ok: true, assignShift });
	} catch (error) {
		console.error("Failed to get assign shift:", error);
		res.status(500).json({ ok: false, message: "Internal Server Error" });
	}
};

export default getAssignShiftController;
