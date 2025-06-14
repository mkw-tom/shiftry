import express from "express";
import { attachStoreId } from "../../middlewares/request/attachStoreId";
import { attachUserId } from "../../middlewares/request/attachUserId";
import { validateUserId } from "../../middlewares/validations/userId.validate";
import changeUserRoleController from "./change-role/controller";
import deleteUserByOwnerController from "./delete-by-user-id/controller";
import deleteUserController from "./delete/controller";
import getUsersFromStoreController from "./get/controller";
import updateUserProfileController from "./put/controller";

const router = express.Router();

router.put(
	"/change-role",
	attachUserId,
	attachStoreId,
	changeUserRoleController,
);
router.delete("/", attachUserId, deleteUserController);
router.delete(
	"/:userId",
	validateUserId,
	attachUserId,
	deleteUserByOwnerController,
);
router.get("/", attachStoreId, getUsersFromStoreController);
router.put("/", attachUserId, updateUserProfileController);

export default router;
