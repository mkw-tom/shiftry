import type { ErrorResponse } from "@shared/api/common/types/errors.js";
import type { StoreConnectLineGroupResponse } from "@shared/api/store/types/connect-line-group.js";
import type { GetUnconnectedStoresMeResponse } from "@shared/api/store/types/me-unconnected.js";
import type { Request, Response } from "express";
import { getUserStoresUnconnectedGroupByUserId } from "../../../repositories/userStore.repository.js";

const getUnconnectedStoreController = async (
	req: Request,
	res: Response<GetUnconnectedStoresMeResponse | ErrorResponse>,
): Promise<void> => {
	try {
		const auth = req.auth;

		if (!auth?.uid)
			return void res.status(401).json({ ok: false, message: "Missing token" });

		const unconnectedStores = await getUserStoresUnconnectedGroupByUserId(
			auth.uid,
		);
		if (unconnectedStores.length === 0) {
			return void res.status(404).json({
				ok: false,
				message: "No unconnected stores found for the user",
			});
		}

		res.json({
			ok: true,
			unconnectedStores: unconnectedStores,
		});
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

export default getUnconnectedStoreController;
