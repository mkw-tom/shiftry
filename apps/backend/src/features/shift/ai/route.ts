import express from "express";
import { attachStoreId } from "../../../middlewares/request/attachStoreId";
import { attachUserId } from "../../../middlewares/request/attachUserId";
import createShiftController from "./create/controller";

const router = express.Router();
// router.use(attachUserId);
// router.use(attachStoreId);

router.post("/create", createShiftController);

export default router;
