import express from "express";
import { attachStoreId } from "../../middlewares/request/attachStoreId.js";
import { attachUserId } from "../../middlewares/request/attachUserId.js";
import getUserJobRoleWithUsersController from "./get-users/controller.js";
import bulkUpsertUserJobRolesController from "./put-bulk/controller.js";

const router = express.Router();

router.use(attachUserId);
router.use(attachStoreId);

router.post("/users", getUserJobRoleWithUsersController);
router.put("/bulk", bulkUpsertUserJobRolesController);

export default router;
