import express from "express";
import { requireUser } from "../../middlewares/auth.js";
import { attachChannelType } from "../../middlewares/request/attachChannelType.js";
import { attachGroupId } from "../../middlewares/request/attachGroupId.js";
import { attachIdToken } from "../../middlewares/request/attachIdToken.js";
import { attachStoreCode } from "../../middlewares/request/attachStoreCode.js";
import { attachStoreId } from "../../middlewares/request/attachStoreId.js";
// import { autoLoginController } from "./auto-login/controller.js";
// import InitController from "./init/controller.js";
import VerifyLiffUserController from "./liff/verify/controller.js";
import { loginController } from "./login/controller.js";
import AuthMeController from "./me/controller.js";
// import lineAuthController from "./line-auth/controller.js";
// import { loginController } from "./login-with-line/controller.js";
import registerOwnerController from "./register/owner/controller.js";
import registerStaffController from "./register/staff/controller.js";
// import registerStaffController from "./register/staff/controller.js";
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
router.post("/login", requireUser, loginController);

router.post("/register/owner", attachIdToken, registerOwnerController);
router.post(
	"/register/staff",
	attachIdToken,
	attachStoreCode,
	registerStaffController,
);
router.post("/liff/verify", attachIdToken, VerifyLiffUserController);
router.post(
	"/select-store",
	attachStoreId,
	requireUser,
	selectStoreLoginController,
);
router.get("/me", requireUser, AuthMeController);

export default router;
