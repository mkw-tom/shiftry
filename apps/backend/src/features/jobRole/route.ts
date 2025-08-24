import express from "express";
import { requireUser } from "../../middlewares/auth.js";
import { attachStoreId } from "../../middlewares/request/attachStoreId.js";
import { attachUserId } from "../../middlewares/request/attachUserId.js";
import getJobRolesByStoreIdController from "./get/controller.js";
import bulkUpsertJobRoleController from "./put-bulk/controller.js";

const router = express.Router();

router.use(requireUser);

router.get("/all", getJobRolesByStoreIdController);
router.put("/bulk", bulkUpsertJobRoleController);

export default router;
