import express from "express";
import { requireUser } from "../../middlewares/auth.js";
import { createStaffPreferenceController } from "./create/controller.js";
import { createBulkStaffPreferenceController } from "./create_bulk/controller.js";
import { getStaffPreferencesController } from "./get/controller.js";
import { getStaffPreferenceAllController } from "./get_all/controller.js";
import { updateStaffPreferenceController } from "./update/controller.js";
import { updateBulkStaffPreferenceController } from "./update_bulk/controller.js";

const router = express.Router();

router.use(requireUser);

router.get("/", getStaffPreferencesController);
router.get("/all", getStaffPreferenceAllController);
router.post("/create", createStaffPreferenceController);
router.post("/create/bulk", createBulkStaffPreferenceController);
router.put("/update", updateStaffPreferenceController);
router.put("/update/bulk", updateBulkStaffPreferenceController);

export default router;
