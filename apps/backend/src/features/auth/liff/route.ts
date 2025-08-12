import express from "express";
import { attachChannel } from "../../../middlewares/request/attachChannel";
import { attachIdToken } from "../../../middlewares/request/attachIdToken";
import VerifyLiffUserController from "./verify/controller";

const router = express.Router();

router.post("/verify", attachIdToken, attachChannel, VerifyLiffUserController);

export default router;
