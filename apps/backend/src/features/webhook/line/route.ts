import express from "express";

import { attachGroupId } from "../../../middlewares/request/attachGroupId";
import { attachStoreId } from "../../../middlewares/request/attachStoreId";
import { attachUserId } from "../../../middlewares/request/attachUserId";
import sendConfirmShiftFuncController from "./confirm-shift/controller";
import eventController from "./event/controller";
import sendShiftRequestFuncController from "./request-shift/controller";
const router = express.Router();

router.post(
	"/request-shift",
	attachUserId,
	attachStoreId,
	attachGroupId,
	sendShiftRequestFuncController,
);
router.post("/event", eventController);
router.post(
	"/confirm-shift",
	attachUserId,
	attachStoreId,
	attachGroupId,
	sendConfirmShiftFuncController,
);

export default router;
