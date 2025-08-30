import type { ErrorResponse } from "@shared/api/common/types/errors.js";
import { RequestsType } from "@shared/api/common/types/json.js";
import type { DeleteShiftRequestResponse } from "@shared/api/shift/request/types/delete-by-week-start.js";
import type { Request, Response } from "express";
import { deleteShiftRequest } from "../../../../repositories/shiftRequest.repository.js";
import { verifyUserStoreForOwnerAndManager } from "../../../common/authorization.service.js";

const deleteShiftRequestController = async (
	req: Request,
	res: Response<DeleteShiftRequestResponse | ErrorResponse>,
): Promise<void> => {
	try {
		const userId = req.userId as string;
		const storeId = req.storeId as string;
		await verifyUserStoreForOwnerAndManager(userId, storeId);

		const weekStart = req.params.weekStart;

		const shiftRequestRaw = await deleteShiftRequest(storeId, weekStart);

		// Ensure requests is either the correct type or undefined
		const isValidRequests = (
			requests: unknown,
		): requests is Record<
			string,
			Record<
				string,
				{
					name: string;
					count: number;
					absolute: {
						name: string;
						id: string;
						pictureUrl?: string | undefined;
					}[];
					priority: {
						name: string;
						id: string;
						level: number;
						pictureUrl?: string | undefined;
					}[];
					jobRoles: string[];
				}
			> | null
		> => {
			return (
				requests === null ||
				(typeof requests === "object" && !Array.isArray(requests))
			);
		};

		const shiftRequest = shiftRequestRaw
			? {
					...shiftRequestRaw,
					requests: isValidRequests(shiftRequestRaw.requests)
						? shiftRequestRaw.requests
						: {},
				}
			: shiftRequestRaw;

		res.json({ ok: true, shiftRequest });
	} catch (error) {
		console.error(error);
		res.status(500).json({ ok: false, message: "Internal Server Error" });
	}
};

export default deleteShiftRequestController;
