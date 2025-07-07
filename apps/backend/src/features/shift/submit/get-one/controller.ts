import type { ErrorResponse } from "@shared/api/common/types/errors";
import type { GetSubmittedShiftUserOneResponse } from "@shared/api/shift/submit/types/get-one";
import type { Request, Response } from "express";
import { getSubmittedShiftUserOne } from "../../../../repositories/submittedShift.repository";
// import { getSubmittedShiftUser } from "../../../../repositories/submittedShift.repository";
import { verifyUserStore } from "../../../common/authorization.service";

const getSubmittedShiftUserOneController = async (
	req: Request,
	res: Response<GetSubmittedShiftUserOneResponse | ErrorResponse>,
): Promise<void> => {
	try {
		const userId = req.userId as string;
		const storeId = req.storeId as string;
		await verifyUserStore(userId, storeId);
		const { shiftRequestId } = req.params;

		// const submittedShifts = await getSubmittedShiftUser(userId, storeId);
		const submittedShift = await getSubmittedShiftUserOne(
			userId,
			shiftRequestId,
		);
		res.status(200).json({ ok: true, submittedShift });
	} catch (error) {
		console.error("Failed to get your submitted shifts:", error);
		res.status(500).json({ ok: false, message: "Internal Server Error" });
	}
};

export default getSubmittedShiftUserOneController;
