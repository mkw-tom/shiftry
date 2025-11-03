import { useGenerateShiftPdf } from "@/app/api/hook/pdf/useGerateShiftPdf";
import React, { use } from "react";
import { BiDownload } from "react-icons/bi";
import { useAdjustShiftForm } from "../context/AdjustShiftFormContextProvider.tsx";

const ShiftPdfButton = () => {
	const { shiftRequestData, assignShiftData } = useAdjustShiftForm();
	const { generateShiftPdf } = useGenerateShiftPdf();

	const handleGeneratePdf = async () => {
		if (!shiftRequestData || !assignShiftData) return;

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
				shiftRequestData.status !== "CONFIRMED"
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
