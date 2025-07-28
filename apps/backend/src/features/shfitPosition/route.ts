import express from "express";
import { attachStoreId } from "../../middlewares/request/attachStoreId";
import { attachUserId } from "../../middlewares/request/attachUserId";
import getShiftPosisiosnByStoreIdController from "./get-by-store-id/controller";
import bulkUpsertShiftPosisionsController from "./put-bulk/controller";

const router = express.Router();

router.use(attachStoreId);
router.use(attachUserId);

router.get("/", getShiftPosisiosnByStoreIdController);
router.put("/bulk", bulkUpsertShiftPosisionsController);

export default router;
