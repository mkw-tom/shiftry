import type {
	ErrorResponse,
	ValidationErrorResponse,
} from "@shared/api/common/types/errors.js";
import type { GetShfitPositionsByStoreIdResponse } from "@shared/api/shiftPosition/types/get-by-store-id.js";
import type { Request, Response } from "express";
import { getShiftPositionsByStoreId } from "../../../repositories/ShiftPosition.js";
import { verifyUserStoreForOwnerAndManager } from "../../common/authorization.service.js";

const getShiftPosisiosnByStoreIdController = async (
	req: Request,
	res: Response<
		GetShfitPositionsByStoreIdResponse | ErrorResponse | ValidationErrorResponse
	>,
) => {
	try {
		const userId = req.userId as string;
		const storeId = req.storeId as string;
		await verifyUserStoreForOwnerAndManager(userId, storeId);

		const shiftPositions = await getShiftPositionsByStoreId(storeId);
		res.json({ ok: true, shiftPositions });
	} catch (error) {
		console.error("Failed to get job roles:", error);
		res.status(500).json({ ok: false, message: "Internal Server Error" });
	}
};

export default getShiftPosisiosnByStoreIdController;
