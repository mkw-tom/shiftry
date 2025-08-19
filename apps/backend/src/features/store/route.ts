import express from "express";
import { requireUser } from "../../middlewares/auth.js";
import { attachChannel } from "../../middlewares/request/attachChannel.js";
import { attachStoreId } from "../../middlewares/request/attachStoreId.js";
// import addManageStoreController from "./add-store/controller.js";
import storeConnectLineGroupController from "./connect-line-group/controller.js";
import getUnconnectedStoreController from "./me-unconnected/controller.js";
// import getStoresFromUserController from "./me/controller.js";
import updateStoreNameControler from "./update-store-name/controller.js";

const router = express.Router();
// router.use(attachUserId);

// router.post("/add-store", addManageStoreController);
router.put(
	"/connect-line-group",
	requireUser,
	attachChannel,
	attachStoreId,
	storeConnectLineGroupController,
);
// router.get("/me", getStoresFromUserController);
router.get("/me/unconnected", requireUser, getUnconnectedStoreController);
router.put("/update-store-name", attachStoreId, updateStoreNameControler);

export default router;
