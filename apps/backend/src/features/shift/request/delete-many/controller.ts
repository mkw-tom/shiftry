import type {
	ErrorResponse,
	ValidationErrorResponse,
} from "@shared/api/common/types/errors";
import type { DeleteManyShiftRequestResponse } from "@shared/api/shift/request/types/delete-many";
import { deleteManyShiftRequestValidate } from "@shared/api/shift/request/validations/delete-many";
import type { Request, Response } from "express";
import {
	deleteManyShiftRequest,
	deleteShiftRequest,
} from "../../../../repositories/shiftRequest.repository";
import { verifyUserStoreForOwnerAndManager } from "../../../common/authorization.service";

const deleteManyShiftRequestController = async (
	req: Request,
	res: Response<
		DeleteManyShiftRequestResponse | ErrorResponse | ValidationErrorResponse
	>,
): Promise<void> => {
	try {
		const userId = req.userId as string;
		const storeId = req.storeId as string;
		await verifyUserStoreForOwnerAndManager(userId, storeId);
		const parse = deleteManyShiftRequestValidate.safeParse(req.body);
		if (!parse.success) {
			res.status(400).json({
				ok: false,
				message: "Invalid request value",
				errors: parse.error.errors,
			});
			return;
		}
		const { ids } = parse.data;

		const { count } = await deleteManyShiftRequest(storeId, ids);

		res.json({ ok: true, deletedCount: count });
	} catch (error) {
		console.error(error);
		res.status(500).json({ ok: false, message: "Internal Server Error" });
	}
};

export default deleteManyShiftRequestController;
