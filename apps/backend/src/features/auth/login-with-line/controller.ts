// import type { LoginResponse } from "@shared/api/auth/types/login.js";
// import type { ErrorResponse } from "@shared/api/common/types/errors.js";
// import type { Request, Response } from "express";
// import { getStoreFromUser } from "../../../repositories/userStore.repository.js";
// import { generateJWT } from "../../../utils/JWT/jwt.js";
// import { verifyUserByLineId } from "../../common/authorization.service.js";

// export const loginController = async (
// 	req: Request,
// 	res: Response<LoginResponse | ErrorResponse>,
// ): Promise<void> => {
// 	try {
// 		const lineId = req.lineId as string;
// 		const user = await verifyUserByLineId(lineId);
// 		const userStoreWithStores = await getStoreFromUser(user.id);
// 		const stores = userStoreWithStores.map((data) => {
// 			return data.store;
// 		});

// 		if (stores.length === 0) {
// 			res.status(401).json({ ok: false, message: "stores is not found" });
// 		}

// 		const user_token = generateJWT({ userId: user.id });

// 		res.status(200).json({ ok: true, user_token, user, stores });
// 	} catch (error) {
// 		console.error("faild to relogin", error);
// 		res.status(401).json({ ok: false, message: "faild to relogin" });
// 	}
// };
