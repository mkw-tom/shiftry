import express from "express";
import { attachStoreId } from "../../../middlewares/request/attachStoreId";
import { attachUserId } from "../../../middlewares/request/attachUserId";
// import { attachStoreIdFromHeader } from "../middlewares/request/attachStoreId";
// import { attachUserIdFromCookie } from "../middlewares/request/cookie/attachUserIdFromCookie";
import { validateshiftRequestId } from "../../../middlewares/validations/shiftRequestId.validate";
import getAssignShiftController from "./get-by-shift-request-id/controller";
import upsertAssignShfitController from "./put/controller";

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
