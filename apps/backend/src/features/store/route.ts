import express from "express";
import { requireUser } from "../../middlewares/auth";
import { attachChannel } from "../../middlewares/request/attachChannel";
import { attachGroupId } from "../../middlewares/request/attachGroupId";
import { attachStoreId } from "../../middlewares/request/attachStoreId";
import { attachUserId } from "../../middlewares/request/attachUserId";
import addManageStoreController from "./add-store/controller";
import storeConnectLineGroupController from "./connect-line-group/controller";
import getStoresFromUserController from "./me/controller";
import updateStoreNameControler from "./update-store-name/controller";

const router = express.Router();
// router.use(attachUserId);

router.post("/add-store", addManageStoreController);
router.put(
	"/connect-line-group",
	requireUser,
	attachChannel,
	attachStoreId,
	storeConnectLineGroupController,
);
router.get("/me", getStoresFromUserController);
router.put("/update-store-name", attachStoreId, updateStoreNameControler);

export default router;
