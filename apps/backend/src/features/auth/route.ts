import express from "express";
import { allowAnon, requireUser } from "../../middlewares/auth";
import { attachChannel } from "../../middlewares/request/attachChannel";
import { attachGroupId } from "../../middlewares/request/attachGroupId";
import { attachIdToken } from "../../middlewares/request/attachIdToken";
import { attachLineId } from "../../middlewares/request/attachLineId";
import { attachStoreId } from "../../middlewares/request/attachStoreId";
import { attachUserId } from "../../middlewares/request/attachUserId";
import { autoLoginController } from "./auto-login/controller";
import InitController from "./init/controller";
import VerifyLiffUserController from "./liff/verify/controller";
import lineAuthController from "./line-auth/controller";
import { loginController } from "./login-with-line/controller";
import registerOwnerController from "./register/owner/controller";
import registerStaffController from "./register/staff/controller";

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
