import express from "express";
import { requireUser } from "../../../middlewares/auth.js";
import { aiShiftAdjustController } from "./adjust/controller.js";

const router = express.Router();
router.use(requireUser);

router.post("/adjust", aiShiftAdjustController);

export default router;
