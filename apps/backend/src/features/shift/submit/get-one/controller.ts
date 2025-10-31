import type { ErrorResponse } from "@shared/api/common/types/errors.js";
import type { GetSubmittedShiftUserOneResponse } from "@shared/api/shift/submit/types/get-one.js";
import type { SubmittedDataType } from "@shared/api/shift/submit/validations/put.js";
import type { Request, Response } from "express";
import { getSubmittedShiftUserOne } from "../../../../repositories/submittedShift.repository.js";
// import { getSubmittedShiftUser } from "../../../../repositories/submittedShift.repository.js";
import { verifyUserStore } from "../../../common/authorization.service.js";
import { toSubmittedShiftDTO } from "../toDTO.js";

const getSubmittedShiftUserOneController = async (
	req: Request,
	res: Response<GetSubmittedShiftUserOneResponse | ErrorResponse>,
): Promise<void> => {
	try {
		const auth = req.auth;
		if (!auth || !auth.uid || !auth.sid) {
			return void res.status(401).json({ ok: false, message: "Unauthorized" });
		}
		await verifyUserStore(auth.uid, auth.sid);
		const { shiftRequestId } = req.params;

		// const submittedShifts = await getSubmittedShiftUser(userId, storeId);
		const submittedShiftRaw = await getSubmittedShiftUserOne(
			auth.uid,
			shiftRequestId,
		);
		if (!submittedShiftRaw) {
			void res.status(404).json({ ok: true, submittedShift: null });
			return;
		}

		const submittedShift = toSubmittedShiftDTO(submittedShiftRaw);

		res.status(200).json({ ok: true, submittedShift });
	} catch (error) {
		console.error("Failed to get your submitted shifts:", error);
		res.status(500).json({ ok: false, message: "Internal Server Error" });
	}
};

export default getSubmittedShiftUserOneController;
