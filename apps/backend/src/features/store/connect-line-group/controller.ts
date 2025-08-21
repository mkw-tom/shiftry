import type { ErrorResponse } from "@shared/api/common/types/errors.js";
import type { StoreConnectLineGroupResponse } from "@shared/api/store/types/connect-line-group.js";
import type { Request, Response } from "express";
import { connectStoreToGroupService } from "./service.js";

const storeConnectLineGroupController = async (
	req: Request,
	res: Response<StoreConnectLineGroupResponse | ErrorResponse>,
): Promise<void> => {
	try {
		const idToken = req.idToken;
		const groupId = req.groupId;
		const storeCode = req.storeCode;

		if (!idToken)
			return void res.status(401).json({ ok: false, message: "Missing token" });
		if (!storeCode)
			return void res
				.status(400)
				.json({ ok: false, message: "StoreCode is required" });
		if (!groupId)
			return void res
				.status(400)
				.json({ ok: false, message: "groupId is required" });

		const response = await connectStoreToGroupService(
			idToken,
			groupId,
			storeCode,
		);

		if (!response.ok) {
			const msg = response.message || "Bad Request";
			let status: number;

			switch (true) {
				case msg.includes("Invalid or missing ID token"):
					status = 401;
					break;
				case msg.includes("not found"):
					status = 404;
					break;
				case msg.includes("permission"):
					status = 403;
					break;
				case msg.includes("already linked"):
					status = 409;
					break;
				default:
					status = 400;
			}

			return void res.status(status).json(response);
		}
		res.status(200).json(response);
	} catch (e) {
		if (typeof e === "object" && e !== null && "status" in e) {
			const err = e as { status: number; message: string };
			return void res
				.status(err.status)
				.json({ ok: false, message: err.message });
		}
		console.error("[storeConnectLineGroup] error", e);
		res.status(500).json({ ok: false, message: "Internal Server Error" });
	}
};

export default storeConnectLineGroupController;
