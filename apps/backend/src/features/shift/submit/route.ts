import express from "express";
import { requireUser } from "../../../middlewares/auth.js";
import { attachStoreId } from "../../../middlewares/request/attachStoreId.js";
import { attachUserId } from "../../../middlewares/request/attachUserId.js";
import { validateshiftRequestId } from "../../../middlewares/validations/shiftRequestId.validate.js";
import getSubmittedShiftsSpesificController from "./get-by-shift-request-id/controller.js";
import getSubmittedShiftMeController from "./get-me/controller.js";
import getSubmittedShiftUserOneController from "./get-one/controller.js";
import upsertSubmittedShiftController from "./put/controller.js";

const router = express.Router();
// router.use(attachUserId);
// router.use(attachStoreId);

router.get("/me", requireUser, getSubmittedShiftMeController);
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
