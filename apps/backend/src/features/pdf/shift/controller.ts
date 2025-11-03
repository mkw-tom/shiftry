import type {
	ErrorResponse,
	ValidationErrorResponse,
} from "@shared/api/common/types/errors.js";
import type { GenerateShiftPdfResponse } from "@shared/api/pdf/types/shift.js";
import { RawShiftJsonValidate } from "@shared/api/pdf/validations/shift.js";
import { YMDW } from "@shared/utils/formatDate.js";
import type { Request, Response } from "express";
import { getStoreById } from "../../../repositories/store.repository.js";
import { generateShiftPdfStream } from "./service.js";

export const generateShiftPdfStreamController = async (
	req: Request,
	res: Response<
		GenerateShiftPdfResponse | ErrorResponse | ValidationErrorResponse
	>,
) => {
	try {
		const auth = req.auth;
		if (!auth?.uid || !auth?.sid) {
			res.status(401).json({ ok: false, message: "Unauthorized" });
			return;
		}

		const store = await getStoreById(auth.sid);
		if (!store) {
			res.status(404).json({ ok: false, message: "Store not found" });
			return;
		}

		const json = RawShiftJsonValidate.parse(req.body);

		const dates = Object.keys(json).sort();
		const period = dates.length
			? `${YMDW(new Date(dates[0]))}〜${YMDW(new Date(dates[dates.length - 1]))}`
			: "";

		const doc = generateShiftPdfStream(json, {
			title: "シフト表",
			periodLabel: period,
			anonymize: false,
			storeName: store.name,
		});

		// ▼▼ ここから：ストリームをバッファに貯めて Base64 で返す ▼▼
		const chunks: Buffer[] = [];
		doc.on("data", (c: Buffer) => chunks.push(c));
		doc.on("error", (err) => {
			console.error(err);
			if (!res.headersSent) {
				res.status(500).json({ ok: false, message: "PDF generation failed" });
			}
		});
		doc.on("end", () => {
			const buffer = Buffer.concat(chunks);
			const base64 = buffer.toString("base64");
			// ← バイナリではなく JSON を返す（APIゲートウェイの制限回避）
			res.json({
				ok: true,
				filename: "shift.pdf",
				mime: "application/pdf",
				encoding: "base64",
				data: base64,
			});
		});

		doc.end();
	} catch (e) {
		console.error(e);
		const message =
			typeof e === "object" && e !== null && "message" in e
				? ((e as { message?: string }).message ?? "Bad Request")
				: "Bad Request";
		res.status(400).json({ ok: false, message });
	}
};
