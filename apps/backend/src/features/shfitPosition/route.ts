import express from "express";
import { attachStoreId } from "../../middlewares/request/attachStoreId.js";
import { attachUserId } from "../../middlewares/request/attachUserId.js";
import getShiftPosisiosnByStoreIdController from "./get-by-store-id/controller.js";
import bulkUpsertShiftPosisionsController from "./put-bulk/controller.js";

const router = express.Router();

router.use(attachStoreId);
router.use(attachUserId);

router.get("/", getShiftPosisiosnByStoreIdController);
router.put("/bulk", bulkUpsertShiftPosisionsController);

export default router;
