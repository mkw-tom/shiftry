import express from "express";
import { attachStoreId } from "../../middlewares/request/attachStoreId";
import { attachUserId } from "../../middlewares/request/attachUserId";
import getUserJobRoleWithUsersController from "./get-users/controller";
import bulkUpsertUserJobRolesController from "./put-bulk/controller";

const router = express.Router();

router.use(attachUserId);
router.use(attachStoreId);

router.post("/users", getUserJobRoleWithUsersController);
router.put("/bulk", bulkUpsertUserJobRolesController);

export default router;
