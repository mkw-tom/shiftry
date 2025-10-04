import express from "express";
import { requireUser } from "../../../middlewares/auth.js";
import shiftConfirmController from "./controller.js";

const router = express.Router();

router.use(requireUser);

router.post("/", shiftConfirmController);

export default router;
