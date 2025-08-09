import type { JobRole } from "@prisma/client";
import type {
	ErrorResponse,
	ValidationErrorResponse,
} from "@shared/api/common/types/errors";
import { putBulkJobRoleValidate } from "@shared/api/jobRole/Validations/put-bulk";
import type { BulkUpsertJobRoleResponse } from "@shared/api/jobRole/types/put-bulk";
import type { BulkUpsertShiftPositionsResponse } from "@shared/api/shiftPosition/types/put-bulk";
import { bulkUpsertShiftPositionValidate } from "@shared/api/shiftPosition/validations/put-bulk";
import type { GetJobRoleWithUsersResonse } from "@shared/api/userJobRole/types/get-users";
import { getUserJobRoleWithUsersValidate } from "@shared/api/userJobRole/validations/get-users";
import type { Request, Response } from "express";
import {
	GetJobRoleByStoreId,
	bulkUpsertJobRoles,
} from "../../../repositories/JobRole";
import { bulkUpsertShiftPositions } from "../../../repositories/ShiftPosition";
import { getUserJobRoleWithUsers } from "../../../repositories/UserJobRole";
import { verifyUserStoreForOwnerAndManager } from "../../common/authorization.service";

const bulkUpsertShiftPosisionsController = async (
	req: Request,
	res: Response<
		BulkUpsertShiftPositionsResponse | ErrorResponse | ValidationErrorResponse
	>,
) => {
	try {
		const userId = req.userId as string;
		const storeId = req.storeId as string;
		await verifyUserStoreForOwnerAndManager(userId, storeId);

		const parsed = bulkUpsertShiftPositionValidate.safeParse(req.body);
		if (!parsed.success) {
			res.status(400).json({
				ok: false,
				message: "Invalid request value",
				errors: parsed.error.errors,
			});
			return;
		}

		const shiftPositions = await bulkUpsertShiftPositions(storeId, parsed.data);
		res.json({ ok: true, shiftPositions });
	} catch (error) {
		console.error("Failed to get job roles:", error);
		res.status(500).json({ ok: false, message: "Internal Server Error" });
	}
};

export default bulkUpsertShiftPosisionsController;
