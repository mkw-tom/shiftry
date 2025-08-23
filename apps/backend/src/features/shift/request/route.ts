import express from "express";

import { requireUser } from "../../../middlewares/auth.js";
import { attachStoreId } from "../../../middlewares/request/attachStoreId.js";
import { attachUserId } from "../../../middlewares/request/attachUserId.js";
import { validateWeekStart } from "../../../middlewares/validations/weekStart.validate.js";
import deleteShiftRequestController from "./delete-by-week-start/controller.js";
import deleteManyShiftRequestController from "./delete-many/controller.js";
import getAcvtiveShiftRequestsController from "./get-active/controller.js";
import getArchiveShiftRequestsController from "./get-archive/controller.js";
import getShiftRequestSpecificController from "./get-by-week-start/controller.js";
import getShiftRequestsController from "./get/controller.js";
import upsertShiftRequestController from "./put/controller.js";

const router = express.Router();
// router.use(attachUserId);
// router.use(attachStoreId);
router.use(requireUser);

router.delete("/:weekStart", validateWeekStart, deleteShiftRequestController);
router.post("/bulk", deleteManyShiftRequestController);
router.get("/", getShiftRequestsController);
router.get("/active", getAcvtiveShiftRequestsController);
router.get("/archive", getArchiveShiftRequestsController);
router.get("/:weekStart", validateWeekStart, getShiftRequestSpecificController);
router.put("/", upsertShiftRequestController);

export default router;
