import express from "express";
import { attachStoreId } from "../../middlewares/request/attachStoreId";
import { attachUserId } from "../../middlewares/request/attachUserId";
import getJobRolesByStoreIdController from "./get/controller";
import bulkUpsertJobRoleController from "./put-bulk/controller";

const router = express.Router();

router.use(attachUserId);
router.use(attachStoreId);

router.get("/", getJobRolesByStoreIdController);
router.put("/bulk", bulkUpsertJobRoleController);

export default router;
