import bodyParser from "body-parser";
import express from "express";
import stripeWebhookController from "./controller.js";

const router = express.Router();

router.post(
	"/stripe",
	bodyParser.raw({ type: "application/json" }),
	stripeWebhookController,
);

export default router;
