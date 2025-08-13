// import type { LineAuthResponse } from "@shared/api/auth/types/line-auth.js";
// import type { ErrorResponse } from "@shared/api/common/types/errors.js";
// import type { Request, Response } from "express";
// import { generateJWT } from "../../../utils/JWT/jwt.js";
// import lineAuth from "./service.js";

// const lineAuthController = async (
// 	req: Request,
// 	res: Response<LineAuthResponse | ErrorResponse>,
// ): Promise<void> => {
// 	try {
// 		const { code } = req.body;
// 		const userData = await lineAuth(code);

// 		if (!userData) {
// 			res
// 				.status(400)
// 				.json({ ok: false, message: "Failed LINE authentication" });
// 			return;
// 		}

// 		const { userId, name, pictureUrl } = userData;

// 		if (!userId || !name || !pictureUrl) {
// 			res
// 				.status(400)
// 				.json({ ok: false, message: "Failed to get user profile" });
// 			return;
// 		}

// 		const line_token = generateJWT({ lineId: userId });

// 		res.status(200).json({
// 			ok: true,
// 			userId,
// 			name,
// 			pictureUrl,
// 			line_token,
// 		});
// 	} catch (error) {
// 		console.error("Error in lineAuthController:", error);
// 		res.status(500).json({ ok: false, message: "Failed LINE Authentication" });
// 	}
// };

// export default lineAuthController;
