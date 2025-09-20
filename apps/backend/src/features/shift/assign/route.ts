import express from "express";
import { requireUser } from "../../../middlewares/auth.js";
import { validateShiftRequestId } from "../../../middlewares/validations/shiftRequestId.validate.js";
import getAssignShiftController from "./get-by-shift-request-id/controller.js";
import upsertAssignShfitController from "./put/controller.js";

const router = express.Router();
router.use(requireUser);

router.put("/", upsertAssignShfitController);
router.get(
	"/:shiftRequestId",
	validateShiftRequestId,
	getAssignShiftController,
);

export default router;
