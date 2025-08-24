import express from "express";

import { requireUser } from "../../../middlewares/auth.js";
import { attachGroupId } from "../../../middlewares/request/attachGroupId.js";
import { attachStoreId } from "../../../middlewares/request/attachStoreId.js";
import { attachUserId } from "../../../middlewares/request/attachUserId.js";
import sendConfirmShiftFuncController from "./confirm-shift/controller.js";
import eventController from "./event/controller.js";
import sendShiftRequestFuncController from "./request-shift/controller.js";
const router = express.Router();

router.post("/request-shift", requireUser, sendShiftRequestFuncController);
router.post("/event", eventController);
router.post(
	"/confirm-shift",
	attachUserId,
	attachStoreId,
	attachGroupId,
	sendConfirmShiftFuncController,
);

export default router;
