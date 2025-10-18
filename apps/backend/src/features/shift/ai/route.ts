import express from "express";
import { attachStoreId } from "../../../middlewares/request/attachStoreId.js";
import { attachUserId } from "../../../middlewares/request/attachUserId.js";
import { aiShiftAdjustController } from "./adjust/controller.js";

const router = express.Router();
router.use(attachUserId);
router.use(attachStoreId);

router.post("/adjust", aiShiftAdjustController);

export default router;
