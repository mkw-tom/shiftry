import express from "express";
import { attachStoreId } from "../../../middlewares/request/attachStoreId.js";
import { attachUserId } from "../../../middlewares/request/attachUserId.js";
// import createShiftController from "./create/controller.js";

const router = express.Router();
router.use(attachUserId);
router.use(attachStoreId);

// router.post("/create", createShiftController);

export default router;
