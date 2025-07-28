import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import authRoutes from "./features/auth/route";
import jobRoleRotes from "./features/jobRole/route";
import paymentRoutes from "./features/payment/route";
import shiftPositionRoutes from "./features/shfitPosition/route";
import aiRoutes from "./features/shift/ai/route";
import assignShiftRoutes from "./features/shift/assign/route";
import shiftRequestRoutes from "./features/shift/request/route";
import submittedShiftRoutes from "./features/shift/submit/route";
import storeRoutes from "./features/store/route";
import userRoutes from "./features/user/route";
import userJobRoleRotes from "./features/userJobRole/route";
import lineRoutes from "./features/webhook/line/route";
import stripeRoutes from "./features/webhook/stripe/route";

import {
	CROSS_ORIGIN_DEV,
	CROSS_ORIGIN_LIFF,
	CROSS_ORIGIN_PROD,
} from "./lib/env";

dotenv.config();

const app = express();
const https = require("node:https");

// 🔹 ミドルウェアの設定
app.use(
	cors({
		origin: [CROSS_ORIGIN_PROD, CROSS_ORIGIN_DEV, CROSS_ORIGIN_LIFF],
		credentials: true,
		allowedHeaders: [
			"Content-Type",
			"Authorization",
			"x-group-id",
			"x-store-id",
			"x-line-id",
		],
	}),
); // CORS の許可
app.use(helmet()); // セキュリティヘッダーの追加
app.use(cookieParser());
app.use(express.json()); // JSON リクエストのパース
app.use(express.urlencoded({ extended: true })); // URL エンコードのサポート

// 🔹 ルーティング設定
app.use("/api/user", userRoutes);
app.use("/webhook/line", lineRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/store", storeRoutes);
app.use("/api/shift/request", shiftRequestRoutes);
app.use("/api/shift/submit", submittedShiftRoutes);
app.use("/api/shift/assign", assignShiftRoutes);
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
