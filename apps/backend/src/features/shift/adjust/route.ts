import express from "express";
import { requireUser } from "../../../middlewares/auth.js";
import { autoShiftAdjustController } from "./auto/controller.js";

const router = express.Router();
router.use(requireUser);

router.post("/auto", autoShiftAdjustController);

export default router;
