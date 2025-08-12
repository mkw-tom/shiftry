import express from "express";
import { attachChannel } from "../../middlewares/request/attachChannel.js";
import { attachGroupId } from "../../middlewares/request/attachGroupId.js";
import { attachIdToken } from "../../middlewares/request/attachIdToken.js";
import { attachLineId } from "../../middlewares/request/attachLineId.js";
import { attachStoreId } from "../../middlewares/request/attachStoreId.js";
import { attachUserId } from "../../middlewares/request/attachUserId.js";
import { autoLoginController } from "./auto-login/controller.js";
import InitController from "./init/controller.js";
import VerifyLiffUserController from "./liff/verify/controller.js";
import lineAuthController from "./line-auth/controller.js";
import { loginController } from "./login-with-line/controller.js";
import registerOwnerController from "./register/owner/controller.js";
import registerStaffController from "./register/staff/controller.js";

const router = express.Router();

router.post("/init", attachUserId, InitController);
router.post("/line-auth", lineAuthController);
router.post(
	"/auto-login",
	attachUserId,
	attachStoreId,
	attachGroupId,
	autoLoginController,
);
router.post("/login", attachLineId, loginController);

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

export default router;
