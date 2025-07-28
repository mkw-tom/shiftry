import type { JobRole } from "@prisma/client";
import type {
	ErrorResponse,
	ValidationErrorResponse,
} from "@shared/api/common/types/errors";
import { putBulkJobRoleValidate } from "@shared/api/jobRole/Validations/put-bulk";
import type { BulkUpsertJobRoleResponse } from "@shared/api/jobRole/types/put-bulk";
import type { GetJobRoleWithUsersResonse } from "@shared/api/userJobRole/types/get-users";
import { getUserJobRoleWithUsersValidate } from "@shared/api/userJobRole/validations/get-users";
import type { Request, Response } from "express";
import {
	GetJobRoleByStoreId,
	bulkUpsertJobRoles,
} from "../../../repositories/JobRole";
import { getUserJobRoleWithUsers } from "../../../repositories/UserJobRole";
import { verifyUserStoreForOwnerAndManager } from "../../common/authorization.service";

const getUserJobRoleWithUsersController = async (
	req: Request,
	res: Response<
		GetJobRoleWithUsersResonse | ErrorResponse | ValidationErrorResponse
	>,
) => {
	try {
		const userId = req.userId as string;
		const storeId = req.storeId as string;
		await verifyUserStoreForOwnerAndManager(userId, storeId);

		const parsed = getUserJobRoleWithUsersValidate.safeParse(req.body);
		if (!parsed.success) {
			res.status(400).json({
				ok: false,
				message: "Invalid request value",
				errors: parsed.error.errors,
			});
			return;
		}

		const roleIds = parsed.data.roleIds;

		const userJobRoleWithUser = await getUserJobRoleWithUsers(roleIds);
		res.json({ ok: true, userJobRoleWithUser });
	} catch (error) {
		console.error("Failed to get job roles:", error);
		res.status(500).json({ ok: false, message: "Internal Server Error" });
	}
};

export default getUserJobRoleWithUsersController;
