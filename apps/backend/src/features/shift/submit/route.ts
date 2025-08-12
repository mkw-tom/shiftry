import express from "express";
import { attachStoreId } from "../../../middlewares/request/attachStoreId.js";
import { attachUserId } from "../../../middlewares/request/attachUserId.js";
import { validateshiftRequestId } from "../../../middlewares/validations/shiftRequestId.validate.js";
import getSubmittedShiftsSpesificController from "./get-by-shift-request-id/controller.js";
import getSubmittedShiftUserOneController from "./get-one/controller.js";
import getSubmittedShiftUserController from "./get/controller.js";
import upsertSubmittedShiftController from "./put/controller.js";

const router = express.Router();
router.use(attachUserId);
router.use(attachStoreId);

router.get("/", getSubmittedShiftUserController);
router.get(
	"/one/:shiftRequestId",
	validateshiftRequestId,
	getSubmittedShiftUserOneController,
);
router.get(
	"/:shiftRequestId",
	validateshiftRequestId,
	getSubmittedShiftsSpesificController,
);
router.put("/", upsertSubmittedShiftController);

export default router;
