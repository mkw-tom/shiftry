import express from "express";

import { attachStoreId } from "../../../middlewares/request/attachStoreId";
import { attachUserId } from "../../../middlewares/request/attachUserId";
import { validateWeekStart } from "../../../middlewares/validations/weekStart.validate";
import deleteShiftRequestController from "./delete-by-week-start/controller";
import deleteManyShiftRequestController from "./delete-many/controller";
import getAcvtiveShiftRequestsController from "./get-active/controller";
import getArchiveShiftRequestsController from "./get-archive/controller";
import getShiftRequestSpecificController from "./get-by-week-start/controller";
import getShiftRequestsController from "./get/controller";
import upsertShiftRequestController from "./put/controller";

const router = express.Router();
router.use(attachUserId);
router.use(attachStoreId);

router.delete("/:weekStart", validateWeekStart, deleteShiftRequestController);
router.post("/bulk", deleteManyShiftRequestController);
router.get("/", getShiftRequestsController);
router.get("/active", getAcvtiveShiftRequestsController);
router.get("/archive", getArchiveShiftRequestsController);
router.get("/:weekStart", validateWeekStart, getShiftRequestSpecificController);
router.put("/", upsertShiftRequestController);

export default router;
