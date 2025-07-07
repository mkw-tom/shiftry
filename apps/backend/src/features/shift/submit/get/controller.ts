import type { ErrorResponse } from "@shared/api/common/types/errors";
import type { GetSubmittedShiftUserResponse } from "@shared/api/shift/submit/types/get";
import type { Request, Response } from "express";
import { getSubmittedShiftUser } from "../../../../repositories/submittedShift.repository";
import { verifyUserStore } from "../../../common/authorization.service";

const getSubmittedShiftUserController = async (
	req: Request,
	res: Response<GetSubmittedShiftUserResponse | ErrorResponse>,
): Promise<void> => {
	try {
		const userId = req.userId as string;
		const storeId = req.storeId as string;
		await verifyUserStore(userId, storeId);

		const submittedShifts = await getSubmittedShiftUser(userId, storeId);
		if (submittedShifts.length === 0) {
			res
				.status(404)
				.json({ ok: false, message: "submittedShifts is not found" });
			return;
		}

		res.status(200).json({ ok: true, submittedShifts });
	} catch (error) {
		console.error("Failed to get your submitted shifts:", error);
		res.status(500).json({ ok: false, message: "Internal Server Error" });
	}
};

export default getSubmittedShiftUserController;
