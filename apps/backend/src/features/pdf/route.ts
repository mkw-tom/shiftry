import express from "express";
import { requireUser } from "../../middlewares/auth.js";
import { generateShiftPdfStreamController } from "./shift/controller.js";

const router = express.Router();

router.use(requireUser);

router.post("/shift", generateShiftPdfStreamController);

export default router;
