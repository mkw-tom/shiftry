import type { ErrorResponse } from "@shared/api/common/types/errors.js";
import type { RequestsType } from "@shared/api/common/types/json.js";
import type { GetArchiveShiftRequestsResponse } from "@shared/api/shift/request/types/get-archive.js";
import type { GetShiftRequestResponse } from "@shared/api/shift/request/types/get.js";
import type { Request, Response } from "express";
import { getArchivedShiftRequests } from "../../../../repositories/shiftRequest.repository.js";
import { getUserStoreByUserIdAndStoreId } from "../../../../repositories/userStore.repository.js";
import { verifyUserStore } from "../../../common/authorization.service.js";

const getArchiveShiftRequestsController = async (
	req: Request,
	res: Response<GetArchiveShiftRequestsResponse | ErrorResponse>,
): Promise<void> => {
	try {
		const auth = req.auth;
		if (!auth?.uid || !auth?.sid) {
			res.status(401).json({ ok: false, message: "Unauthorized" });
			return;
		}

		const existing = await getUserStoreByUserIdAndStoreId(auth.uid, auth.sid);
		if (!existing) {
			res.status(403).json({ ok: false, message: "Forbidden" });
			return;
		}

		const archiveShiftRequestsRaw = await getArchivedShiftRequests(auth.sid);

		const archiveShiftRequests = archiveShiftRequestsRaw.map((request) => ({
			...request,
			requests:
				request.requests === null ? {} : (request.requests as RequestsType),
		}));

		res.status(200).json({ ok: true, archiveShiftRequests });
	} catch (error) {
		console.error(error);
		res.status(500).json({ ok: false, message: "Internal Server Error" });
	}
};

export default getArchiveShiftRequestsController;
