import { storeIdValidate } from "@shared/api/auth/validations/init.js";
import type { Request, Response } from "express";
import { getStoreById } from "../../../repositories/store.repository.js"; // store列を確定させる用（include済なら不要）
import { getUserStoreByUserIdAndStoreId } from "../../../repositories/userStore.repository.js";
import { signAppJwt } from "../../../utils/jwt.js";

const selectStoreLoginController = async (req: Request, res: Response) => {
	try {
		const auth = req.auth;
		if (!auth?.uid) {
			res
				.status(401)
				.json({ ok: false, code: "UNAUTHORIZED", message: "Unauthorized" });
			return;
		}

		const parsed = storeIdValidate.safeParse(req.body);
		if (!parsed.success) {
			res.status(400).json({
				ok: false,
				code: "BAD_REQUEST",
				message: "Invalid request body",
				errors: parsed.error.errors,
			});
			return;
		}

		const { storeId } = parsed.data;
		if (!storeId) {
			res.status(400).json({
				ok: false,
				code: "BAD_REQUEST",
				message: "storeId is required",
			});
			return;
		}

		const userStore = await getUserStoreByUserIdAndStoreId(auth.uid, storeId);
		if (!userStore) {
			res
				.status(403)
				.json({
					ok: false,
					code: "STORE_FORBIDDEN",
					message: "Store not linked to user",
				});
			return;
		}

		const store = userStore.store ?? (await getStoreById(storeId));
		if (!store) {
			res
				.status(404)
				.json({
					ok: false,
					code: "STORE_NOT_FOUND",
					message: "Store not found",
				});
			return;
		}

		const access = signAppJwt({
			uid: auth.uid,
			sid: userStore.storeId,
			role: userStore.role,
		});

		res.status(200).json({
			ok: true,
			session: { access },
			activeStore: { id: store.id, name: store.name, isActive: store.isActive },
			role: userStore.role,
		});
	} catch (error) {
		console.error("Error in selectStoreLoginController:", error);
		res
			.status(500)
			.json({
				ok: false,
				code: "SERVER_ERROR",
				message: "Internal server error",
			});
	}
};

export default selectStoreLoginController;
