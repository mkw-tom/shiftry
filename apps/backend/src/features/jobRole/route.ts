import express from "express";
import { attachStoreId } from "../../middlewares/request/attachStoreId.js";
import { attachUserId } from "../../middlewares/request/attachUserId.js";
import getJobRolesByStoreIdController from "./get/controller.js";
import bulkUpsertJobRoleController from "./put-bulk/controller.js";

const router = express.Router();

router.use(attachUserId);
router.use(attachStoreId);

router.get("/", getJobRolesByStoreIdController);
router.put("/bulk", bulkUpsertJobRoleController);

export default router;
