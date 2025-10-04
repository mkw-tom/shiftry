import express from "express";
import { requireUser } from "../../../middlewares/auth.js";
import notificationConfirmedShiftController from "./confirm/controller.js";

const router = express.Router();

router.use(requireUser);

router.post("/confirm", notificationConfirmedShiftController);

export default router;
