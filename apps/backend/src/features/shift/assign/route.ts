import express from "express";
import { attachStoreId } from "../../../middlewares/request/attachStoreId.js";
import { attachUserId } from "../../../middlewares/request/attachUserId.js";
// import { attachStoreIdFromHeader } from "../middlewares/request/attachStoreId.js";
// import { attachUserIdFromCookie } from "../middlewares/request/cookie/attachUserIdFromCookie.js";
import { validateshiftRequestId } from "../../../middlewares/validations/shiftRequestId.validate.js";
import getAssignShiftController from "./get-by-shift-request-id/controller.js";
import upsertAssignShfitController from "./put/controller.js";

const router = express.Router();
router.use(attachUserId);
router.use(attachStoreId);

router.put("/", upsertAssignShfitController);
router.get(
	"/:shiftRequestId",
	validateshiftRequestId,
	getAssignShiftController,
);

export default router;
