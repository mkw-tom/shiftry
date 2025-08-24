import type {
	ErrorResponse,
	ValidationErrorResponse,
} from "@shared/api/common/types/errors.js";
import { putBulkJobRoleValidate } from "@shared/api/jobRole/Validations/put-bulk.js";
import type { BulkUpsertJobRoleResponse } from "@shared/api/jobRole/types/put-bulk.js";
import type { Request, Response } from "express";
import { bulkUpsertJobRoles } from "../../../repositories/JobRole.js";
import { verifyUserStoreForOwnerAndManager } from "../../common/authorization.service.js";

const bulkUpsertJobRoleController = async (
	req: Request,
	res: Response<
		BulkUpsertJobRoleResponse | ErrorResponse | ValidationErrorResponse
	>,
) => {
	try {
		const auth = req.auth;
		if (!auth?.uid || !auth?.sid) {
			res.status(401).json({ ok: false, message: "Unauthorized" });
			return;
		}
		const parsed = putBulkJobRoleValidate.safeParse(req.body);
		if (!parsed.success) {
			res.status(400).json({
				ok: false,
				message: "Invalid request value",
				errors: parsed.error.errors,
			});
			return;
		}

		await verifyUserStoreForOwnerAndManager(auth.uid, auth.sid);

		const names = parsed.data.names;
		const jobRoles = await bulkUpsertJobRoles(auth.sid, names);

		res.json({ ok: true, jobRoles });
	} catch (error) {
		console.error("Failed to get job roles:", error);
		res.status(500).json({ ok: false, message: "Internal Server Error" });
	}
};

export default bulkUpsertJobRoleController;
