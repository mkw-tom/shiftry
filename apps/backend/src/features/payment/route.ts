import express from "express";

import { attachStoreId } from "../../middlewares/request/attachStoreId.js";
import { attachUserId } from "../../middlewares/request/attachUserId.js";
import cancelRevertController from "./cancel-revert/controller.js";
import cancelSubscriptionController from "./cancel/controller.js";
import changePlanController from "./change-plan/controller.js";
import getPaymentController from "./get/controller.js";
import createPaymentController from "./post/controller.js";

const router = express.Router();

router.use(attachUserId);
router.use(attachStoreId);

router.post("/cancel", cancelSubscriptionController);
router.post("/cancel-revert", cancelRevertController);
router.post("/change-plan", changePlanController);
router.get("/", getPaymentController);
router.post("/", createPaymentController);

export default router;
