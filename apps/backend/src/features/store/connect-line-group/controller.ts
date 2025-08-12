import type { ErrorResponse } from "@shared/api/common/types/errors.js";
import type { StoreConnectLineGroupResponse } from "@shared/api/store/types/connect-line-group.js";
import type { Request, Response } from "express";
import { verifyUserStoreForOwner } from "../../common/authorization.service.js";
import { connectStoreToGroupService } from "./service.js";

const storeConnectLineGroupController = async (
	req: Request,
	res: Response<StoreConnectLineGroupResponse | ErrorResponse>,
): Promise<void> => {
	try {
		const auth = req.auth;
		const channel = req.channel;
		const storeId = req.storeId;

		if (!auth?.uid)
			return void res.status(401).json({ ok: false, message: "Missing token" });
		if (!storeId)
			return void res
				.status(400)
				.json({ ok: false, message: "X-Store-Id required" });
		if (!channel || channel.type !== "group" || !channel.id) {
			return void res.status(400).json({
				ok: false,
				message: "X-Channel-Type must be 'group' and X-Channel-Id required",
			});
		}

		await verifyUserStoreForOwner(auth.uid, storeId);

		const store = await connectStoreToGroupService(
			storeId,
			channel.type,
			channel.id,
		);
		res.json({ ok: true, store });
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
