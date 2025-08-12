import type { JobRole } from "@prisma/client";
import type {
	ErrorResponse,
	ValidationErrorResponse,
} from "@shared/api/common/types/errors.js";
import { putBulkJobRoleValidate } from "@shared/api/jobRole/Validations/put-bulk.js";
import type { BulkUpsertJobRoleResponse } from "@shared/api/jobRole/types/put-bulk.js";
import type { BulkUpsertJobRolesResonse } from "@shared/api/userJobRole/types/put-bulk.js";
import { BulkUpsertUserJobRolesValidate } from "@shared/api/userJobRole/validations/put-bulk.js";
import type { Request, Response } from "express";
import {
	GetJobRoleByStoreId,
	bulkUpsertJobRoles,
} from "../../../repositories/JobRole.js";
import { BulkUpsertUserJobRoles } from "../../../repositories/UserJobRole.js";
import { verifyUserStoreForOwnerAndManager } from "../../common/authorization.service.js";

const bulkUpsertUserJobRolesController = async (
	req: Request,
	res: Response<
		BulkUpsertJobRolesResonse | ErrorResponse | ValidationErrorResponse
	>,
) => {
	try {
		const userId = req.userId as string;
		const storeId = req.storeId as string;
		await verifyUserStoreForOwnerAndManager(userId, storeId);

		const parsed = BulkUpsertUserJobRolesValidate.safeParse(req.body);
		if (!parsed.success) {
			res.status(400).json({
				ok: false,
				message: "Invalid request value",
				errors: parsed.error.errors,
			});
			return;
		}

		const { staffUserId, roleIds } = parsed.data;

		const userJobRoles = await BulkUpsertUserJobRoles(staffUserId, roleIds);
		if (!userJobRoles) {
			res.status(404).json({ ok: false, message: "User job roles not found" });
			return;
		}

		res.json({ ok: true, userJobRoles });
	} catch (error) {
		console.error("Failed to get job roles:", error);
		res.status(500).json({ ok: false, message: "Internal Server Error" });
	}
};

export default bulkUpsertUserJobRolesController;
