import express from "express";
import { attachChannel } from "../../../middlewares/request/attachChannel.js";
import { attachIdToken } from "../../../middlewares/request/attachIdToken.js";
import VerifyLiffUserController from "./verify/controller.js";

const router = express.Router();

router.post("/verify", attachIdToken, attachChannel, VerifyLiffUserController);

export default router;
