import type { ErrorResponse } from "@shared/api/common/types/errors.js";
import type { GetSubmittedShiftMeResponse } from "@shared/api/shift/submit/types/get-me.js";
import type { Request, Response } from "express";
import { getSubmittedShiftUser } from "../../../../repositories/submittedShift.repository.js";
import { verifyUserStore } from "../../../common/authorization.service.js";

const getSubmittedShiftMeController = async (
	req: Request,
	res: Response<GetSubmittedShiftMeResponse | ErrorResponse>,
): Promise<void> => {
	try {
		const auth = req.auth;
		if (!auth || !auth.uid || !auth.sid) {
			return void res.status(401).json({ ok: false, message: "Unauthorized" });
		}

		const submittedShifts = await getSubmittedShiftUser(auth.uid, auth.sid);
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

export default getSubmittedShiftMeController;
