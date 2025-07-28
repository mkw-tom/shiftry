import type { JobRole } from "@prisma/client";
import type { ErrorResponse } from "@shared/api/common/types/errors";
import type { GetJobRolesResponse } from "@shared/api/jobRole/types/get";
import type { Request, Response } from "express";
import { GetJobRoleByStoreId } from "../../../repositories/JobRole";
import { verifyUserStoreForOwnerAndManager } from "../../common/authorization.service";

const getJobRolesByStoreIdController = async (
	req: Request,
	res: Response<GetJobRolesResponse | ErrorResponse>,
) => {
	const userId = req.userId as string;
	const storeId = req.storeId as string;
	await verifyUserStoreForOwnerAndManager(userId, storeId);

	try {
		const storeId = req.storeId as string;
		if (!storeId) {
			res.status(400).json({ ok: false, message: "Store ID is required" });
			return;
		}

		const jobRoles = await GetJobRoleByStoreId(storeId);
		res.json({ ok: true, jobRoles });
	} catch (error) {
		console.error("Failed to get job roles:", error);
		res.status(500).json({ ok: false, message: "Internal Server Error" });
	}
};

export default getJobRolesByStoreIdController;
