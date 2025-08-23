import express from "express";
import { requireUser } from "../../middlewares/auth.js";
import { attachStoreId } from "../../middlewares/request/attachStoreId.js";
import { attachUserId } from "../../middlewares/request/attachUserId.js";
import { validateUserId } from "../../middlewares/validations/userId.validate.js";
// import changeUserRoleController from "./change-role/controller.js";
// import deleteUserByOwnerController from "./delete-by-user-id/controller.js";
import deleteUserController from "./delete/controller.js";
import getMemberFromStoreController from "./get-member/controller.js";
import updateUserProfileController from "./put/controller.js";

const router = express.Router();

// router.put(
// 	"/change-role",
// 	attachUserId,
// 	attachStoreId,
// 	changeUserRoleController,
// );
router.delete("/", attachUserId, deleteUserController);
// router.delete(
// 	"/:userId",
// 	validateUserId,
// 	attachUserId,
// 	deleteUserByOwnerController,
// );
router.get("/member", requireUser, getMemberFromStoreController);
router.put("/", attachUserId, updateUserProfileController);

export default router;
