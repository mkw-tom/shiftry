import express from "express";

import { attachStoreId } from "../../middlewares/request/attachStoreId";
import { attachUserId } from "../../middlewares/request/attachUserId";
import cancelRevertController from "./cancel-revert/controller";
import cancelSubscriptionController from "./cancel/controller";
import changePlanController from "./change-plan/controller";
import getPaymentController from "./get/controller";
import createPaymentController from "./post/controller";

const router = express.Router();

router.use(attachUserId);
router.use(attachStoreId);

router.post("/cancel", cancelSubscriptionController);
router.post("/cancel-revert", cancelRevertController);
router.post("/change-plan", changePlanController);
router.get("/", getPaymentController);
router.post("/", createPaymentController);

export default router;
