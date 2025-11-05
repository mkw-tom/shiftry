import { useGenerateShiftPdf } from "@/app/api/hook/pdf/useGerateShiftPdf";
import liff from "@line/liff";
import React from "react";
import { BiDownload } from "react-icons/bi";
import { useAdjustShiftForm } from "../context/AdjustShiftFormContextProvider.tsx";

function isInLINEWebView(): boolean {
	// 1) LIFF SDK があれば最優先で使う
	// @ts-ignore
	const inClient = typeof window !== "undefined" && window.liff?.isInClient?.();
	if (inClient) return true;

	// 2) UAフォールバック
	const ua = (
		typeof navigator !== "undefined" ? navigator.userAgent : ""
	).toLowerCase();
	// iOS/Android両対応のLINE判定
	return ua.includes(" line/") || ua.includes(" line ");
}

function hasExtParam(): boolean {
	if (typeof window === "undefined") return false;
	return new URLSearchParams(window.location.search).get("ext") === "1";
}

const ShiftPdfButton = () => {
	const { shiftRequestData, assignShiftData } = useAdjustShiftForm();
	const { generateShiftPdf } = useGenerateShiftPdf();

	const openExternallySameUrl = () => {
		const url = new URL(window.location.href);
		url.searchParams.set("ext", "1"); // 外部遷移後はconfirmを出さない
		if (typeof liff !== "undefined" && liff.isInClient()) {
			liff.openWindow({
				url: url.toString(),
				external: true, // 外部ブラウザで開く
			});
		} else {
			window.open(url.toString(), "_blank"); // 通常ブラウザ用フォールバック
		}
	};

	const handleGeneratePdf = async () => {
		if (!shiftRequestData || !assignShiftData) return;

		// LINE内かつ、まだ外部遷移していない（ext=1が付いていない）なら外部へ
		if (isInLINEWebView() && !hasExtParam()) {
			const ok = window.confirm(
				"LINEアプリ内ではPDFを保存できません。外部ブラウザで開きますか？",
			);
			if (ok) openExternallySameUrl();
			return;
		}

		// ここから通常ブラウザ（または ext=1 付きで再表示された外部ブラウザ）
		const transformedShifts = Object.fromEntries(
			Object.entries(assignShiftData.shifts).map(([date, shiftObj]) => [
				date,
				Object.fromEntries(
					Object.entries(shiftObj).map(([shiftId, shift]) => [
						shiftId,
						{
							status: shift.status ?? "",
							name: shift.name,
							count: shift.count,
							assigned: shift.assigned.map((a) => ({
								uid: a.uid,
								displayName: a.displayName,
								source: String(a.source),
								pictureUrl: a.pictureUrl,
								confirmed: a.confirmed,
							})),
							assignedCount: shift.assignedCount ?? 0,
							vacancies: shift.vacancies ?? 0,
							jobRoles: shift.jobRoles ?? [],
						},
					]),
				),
			]),
		);

		const res = await generateShiftPdf({ jsonData: transformedShifts });

		if ("ok" in res && res.ok) {
			const blob = await (
				await fetch(`data:${res.mime};base64,${res.data}`)
			).blob();
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = res.filename || "shift.pdf";
			document.body.appendChild(a);
			a.click();
			a.remove();
			URL.revokeObjectURL(url);
		} else {
			alert("PDFの生成に失敗しました。");
		}
	};

	return (
		<button
			type="button"
			className={`btn btn-sm bg-black text-white font-bold px-4 border-none flex-1 ${
				shiftRequestData?.status !== "CONFIRMED"
					? "opacity-20 pointer-events-none"
					: ""
			}`}
			onClick={handleGeneratePdf}
		>
			<BiDownload />
			PDF
		</button>
	);
};

export default ShiftPdfButton;
