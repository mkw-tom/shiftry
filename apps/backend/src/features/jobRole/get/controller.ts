import type { ErrorResponse } from "@shared/api/common/types/errors.js";
import type { GetJobRolesResponse } from "@shared/api/jobRole/types/get.js";
import type { Request, Response } from "express";
import { GetJobRoleByStoreId } from "../../../repositories/JobRole.js";
import { verifyUserStoreForOwnerAndManager } from "../../common/authorization.service.js";

const getJobRolesByStoreIdController = async (
	req: Request,
	res: Response<GetJobRolesResponse | ErrorResponse>,
) => {
	try {
		const auth = req.auth;
		if (!auth?.uid || !auth?.sid) {
			res.status(401).json({ ok: false, message: "Unauthorized" });
			return;
		}
		await verifyUserStoreForOwnerAndManager(auth.uid, auth.sid);

		const jobRoles = await GetJobRoleByStoreId(auth.sid);
		res.json({ ok: true, jobRoles });
	} catch (error) {
		console.error("Failed to get job roles:", error);
		res.status(500).json({ ok: false, message: "Internal Server Error" });
	}
};

export default getJobRolesByStoreIdController;
