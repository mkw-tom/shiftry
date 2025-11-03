import fs from "node:fs";
import path from "node:path";
import type { Readable } from "node:stream";
import type { RawShiftJsonInput } from "@shared/api/pdf/validations/shift.js";
// apps/backend/src/features/pdf/pdf.service.ts
import PDFDocument from "pdfkit";
import { mapRawToRows } from "./mapper.js";

export type GenerateOptions = {
	title?: string; // 見出し（店名など）
	periodLabel?: string; // "2025-11-10〜2025-11-16"
	anonymize?: boolean; // 氏名匿名化
	storeName?: string; // 店舗名（ヘッダに表示する場合など）
};

export function generateShiftPdfStream(
	raw: RawShiftJsonInput,
	opts: GenerateOptions = {},
): PDFKit.PDFDocument & Readable {
	const doc = new PDFDocument({
		size: "A4",
		layout: "portrait",
		margins: { top: 56, bottom: 56, left: 40, right: 40 },
		bufferPages: true,
		pdfVersion: "1.7",
	}) as PDFKit.PDFDocument & Readable;

	// フォント（日本語）
	const fontPath = path.join(
		process.cwd(),
		"src",
		"assets",
		"fonts",
		"NotoSansJP-Regular.ttf",
	);
	const fontBuf = fs.readFileSync(fontPath);
	// @ts-ignore
	doc.registerFont("jp", fontBuf);
	doc.font("jp");

	// ヘッダ
	const title = opts.title ?? "シフト表";
	const storeName = opts.storeName ? `${opts.storeName}` : "";
	doc.fontSize(14).text(title, { align: "left" });
	if (storeName) {
		doc.fontSize(12).text(storeName, { align: "left" });
		doc.moveDown(0.2);
	}
	if (opts.periodLabel) {
		doc.moveDown(0.1);
		doc.fontSize(10).fillColor("#666").text(opts.periodLabel);
		doc.fillColor("#000");
	}
	doc.moveDown(0.6);

	// 表ヘッダ
	const pageW = doc.page.width - doc.page.margins.left - doc.page.margins.right;
	// 列幅設定を更新
	const colW = {
		date: 70,
		time: 90,
		pos: 90,
		count: 60,
		staff: pageW - (70 + 90 + 90 + 60 + 50),
		vac: 50,
	};
	drawHeader(doc, colW);

	// ...
	const rows = mapRawToRows(raw);
	const lastDate = "";
	for (const r of rows) {
		ensureSpace(doc, 20);
		const dateText = r.isFirstOfDate ? `${fmtDate(r.date)}${r.weekday}` : "";
		drawRow(doc, colW, {
			date: dateText,
			time: r.timeRange,
			pos: r.positionName,
			count: `${r.assignedCount}名`,
			staff: r.staffNames || "-",
			vac: String(r.vacancies),
		});
	}
	// フッタ（ページ番号）
	const range = doc.bufferedPageRange();
	for (let i = range.start; i < range.start + range.count; i++) {
		doc.switchToPage(i);
		const footer = `${i - range.start + 1} / ${range.count}`;
		doc.fontSize(8).fillColor("#666");
		doc.text(footer, 0, doc.page.height - 40, { align: "center" });
		doc.fillColor("#000");
	}

	// 呼び出し元が pipe する前提なので、ここでは end しない
	return doc;
}

// ====== 描画ユーティリティ ======
function drawHeader(doc: PDFKit.PDFDocument, w: Record<string, number>) {
	const x = doc.page.margins.left;
	const y = doc.y;
	const h = 20;

	doc
		.save()
		.rect(x, y, sum(Object.values(w)), h)
		.fill("#F5F5F5")
		.restore();

	doc.rect(x, y, w.date, h).stroke();
	doc.rect(x + w.date, y, w.time, h).stroke();
	doc.rect(x + w.date + w.time, y, w.pos, h).stroke();
	doc.rect(x + w.date + w.time + w.pos, y, w.count, h).stroke();
	doc.rect(x + w.date + w.time + w.pos + w.count, y, w.staff, h).stroke();
	doc
		.rect(x + w.date + w.time + w.pos + w.count + w.staff, y, w.vac, h)
		.stroke();

	doc.fontSize(10);
	doc.text("日付", x + 6, y + 5, { width: w.date - 12 });
	doc.text("時間", x + w.date + 6, y + 5, { width: w.time - 12 });
	doc.text("ポジション", x + w.date + w.time + 6, y + 5, { width: w.pos - 12 });
	doc.text("出勤", x + w.date + w.time + w.pos + 6, y + 5, {
		width: w.count - 12,
	});
	doc.text("スタッフ", x + w.date + w.time + w.pos + w.count + 6, y + 5, {
		width: w.staff - 12,
	});
	doc.text("欠員", x + w.date + w.time + w.pos + w.count + w.staff + 6, y + 5, {
		width: w.vac - 12,
	});

	doc.y = y + h;
	doc.x = x;
}

function drawRow(
	doc: PDFKit.PDFDocument,
	w: Record<string, number>,
	cells: {
		date: string;
		time: string;
		pos: string;
		count: string;
		staff: string;
		vac: string;
	},
) {
	const x = doc.page.margins.left;
	const y = doc.y;
	const h = 20;

	doc.rect(x, y, w.date, h).stroke();
	doc.rect(x + w.date, y, w.time, h).stroke();
	doc.rect(x + w.date + w.time, y, w.pos, h).stroke();
	doc.rect(x + w.date + w.time + w.pos, y, w.count, h).stroke();
	doc.rect(x + w.date + w.time + w.pos + w.count, y, w.staff, h).stroke();
	doc
		.rect(x + w.date + w.time + w.pos + w.count + w.staff, y, w.vac, h)
		.stroke();

	doc.fontSize(9);
	doc.text(cells.date, x + 6, y + 5, { width: w.date - 12 });
	doc.text(cells.time, x + w.date + 6, y + 5, { width: w.time - 12 });
	doc.text(cells.pos, x + w.date + w.time + 6, y + 5, { width: w.pos - 12 });
	doc.text(cells.count, x + w.date + w.time + w.pos + 6, y + 5, {
		width: w.count - 12,
	});
	doc.text(cells.staff, x + w.date + w.time + w.pos + w.count + 6, y + 5, {
		width: w.staff - 12,
	});
	doc.text(
		cells.vac,
		x + w.date + w.time + w.pos + w.count + w.staff + 6,
		y + 5,
		{ width: w.vac - 12 },
	);

	doc.y = y + h;
	doc.x = x;
}

function ensureSpace(doc: PDFKit.PDFDocument, need: number) {
	const bottom = doc.page.height - doc.page.margins.bottom;
	if (doc.y + need > bottom) doc.addPage();
}

function anonymizeList(s: string) {
	if (!s) return s;
	return s
		.split(",")
		.map((v) => v.trim())
		.filter(Boolean)
		.map((n) => (n ? `${n[0]}**` : ""))
		.join(", ");
}

function fmtDate(iso: string) {
	const d = new Date(`${iso}T00:00:00`);
	return `${d.getMonth() + 1}/${d.getDate()}`;
}
function sum(ns: number[]) {
	return ns.reduce((a, b) => a + b, 0);
}
