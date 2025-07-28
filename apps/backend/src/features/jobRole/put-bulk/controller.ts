import type { JobRole } from "@prisma/client";
import type {
	ErrorResponse,
	ValidationErrorResponse,
} from "@shared/api/common/types/errors";
import { putBulkJobRoleValidate } from "@shared/api/jobRole/Validations/put-bulk";
import type { BulkUpsertJobRoleResponse } from "@shared/api/jobRole/types/put-bulk";
import type { Request, Response } from "express";
import {
	GetJobRoleByStoreId,
	bulkUpsertJobRoles,
} from "../../../repositories/JobRole";
import { verifyUserStoreForOwnerAndManager } from "../../common/authorization.service";

const bulkUpsertJobRoleController = async (
	req: Request,
	res: Response<
		BulkUpsertJobRoleResponse | ErrorResponse | ValidationErrorResponse
	>,
) => {
	try {
		const userId = req.userId as string;
		const storeId = req.storeId as string;
		await verifyUserStoreForOwnerAndManager(userId, storeId);

		const parsed = putBulkJobRoleValidate.safeParse(req.body);
		if (!parsed.success) {
			res.status(400).json({
				ok: false,
				message: "Invalid request value",
				errors: parsed.error.errors,
			});
			return;
		}

		const names = parsed.data.names;

		const jobRoles = await bulkUpsertJobRoles(storeId, names);
		res.json({ ok: true, jobRoles });
	} catch (error) {
		console.error("Failed to get job roles:", error);
		res.status(500).json({ ok: false, message: "Internal Server Error" });
	}
};

export default bulkUpsertJobRoleController;
