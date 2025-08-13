import express from "express";
import { requireUser } from "../../middlewares/auth.js";
import { attachChannel } from "../../middlewares/request/attachChannel.js";
import { attachIdToken } from "../../middlewares/request/attachIdToken.js";
// import { autoLoginController } from "./auto-login/controller.js";
// import InitController from "./init/controller.js";
import VerifyLiffUserController from "./liff/verify/controller.js";
// import lineAuthController from "./line-auth/controller.js";
// import { loginController } from "./login-with-line/controller.js";
import registerOwnerController from "./register/owner/controller.js";
import registerStaffController from "./register/staff/controller.js";
import selectStoreLoginController from "./select-store/controller.js";

const router = express.Router();

// router.post("/init", attachUserId, InitController);
// router.post("/line-auth", lineAuthController);
// router.post(
// 	"/auto-login",
// 	attachUserId,
// 	attachStoreId,
// 	attachGroupId,
// 	autoLoginController,
// );
// router.post("/login", attachLineId, loginController);

router.post("/register/owner", attachIdToken, registerOwnerController);
router.post(
	"/register/staff",
	attachIdToken,
	attachChannel,
	registerStaffController,
);
router.post(
	"/liff/verify",
	attachIdToken,
	attachChannel,
	VerifyLiffUserController,
);
router.post("/select-store", requireUser, selectStoreLoginController);

export default router;
