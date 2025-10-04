import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import authRoutes from "./features/auth/route.js";
import jobRoleRotes from "./features/jobRole/route.js";
import paymentRoutes from "./features/payment/route.js";
import shiftPositionRoutes from "./features/shfitPosition/route.js";
import aiRoutes from "./features/shift/ai/route.js";
import assignShiftRoutes from "./features/shift/assign/route.js";
import shiftConfirmRoutes from "./features/shift/confirm/route.js";
import shiftRequestRoutes from "./features/shift/request/route.js";
import submittedShiftRoutes from "./features/shift/submit/route.js";
import storeRoutes from "./features/store/route.js";
import userRoutes from "./features/user/route.js";
import userJobRoleRotes from "./features/userJobRole/route.js";
import lineRoutes from "./features/webhook/line/route.js";
import stripeRoutes from "./features/webhook/stripe/route.js";

import {
	CROSS_ORIGIN_DEV,
	CROSS_ORIGIN_LIFF,
	CROSS_ORIGIN_PROD,
} from "./lib/env.js";

dotenv.config();

const app = express();
// app.set("trust proxy", true);

// 🔹 ミドルウェアの設定
app.use(helmet());
app.use(
	cors({
		origin: [CROSS_ORIGIN_PROD, CROSS_ORIGIN_DEV, CROSS_ORIGIN_LIFF],
		credentials: true,
		allowedHeaders: [
			"Content-Type",
			"Authorization",
			"x-id-token",
			"x-channel-id",
			"x-channel-type",
			"x-group-id",
			"x-store-id",
			"x-line-id",
			"x-store-code",
		],
		methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
		optionsSuccessStatus: 204,
	}),
); // CORS の許可
app.use(express.json({ limit: "200kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(
	rateLimit({
		windowMs: 60_000,
		max: 120,
		standardHeaders: true,
		legacyHeaders: false,
		message: { ok: false, message: "Too many requests" },
		skip: (req) =>
			req.path.startsWith("/health") ||
			req.path.startsWith("/metrics") ||
			req.path.startsWith("/webhook/line") ||
			req.path.startsWith("/webhook/stripe"),
	}),
);

// 🔹 ルーティング設定
app.use("/api/user", userRoutes);
app.use("/webhook/line", lineRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/store", storeRoutes);
app.use("/api/shift/request", shiftRequestRoutes);
app.use("/api/shift/submit", submittedShiftRoutes);
app.use("/api/shift/assign", assignShiftRoutes);
app.use("/api/shift/confirm", shiftConfirmRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/webhook/strip", stripeRoutes);
app.use("/api/shift/ai", aiRoutes);
app.use("/api/jobrole", jobRoleRotes);
app.use("/api/userjobrole", userJobRoleRotes);
app.use("/api/shift-position", shiftPositionRoutes);

app.use(
	(
		err: Error,
		req: express.Request,
		res: express.Response,
		next: express.NextFunction,
	) => {
		console.error(err.stack);
		res.status(500).json({ error: "Internal Server Error" });
	},
);

export default app;
