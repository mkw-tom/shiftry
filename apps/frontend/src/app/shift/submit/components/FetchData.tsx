"use client";
import type { ShiftRequestDTO } from "@shared/api/shift/request/dto";
import { useSearchParams } from "next/navigation";
import {
	type PropsWithChildren,
	useCallback,
	useEffect,
	useState,
} from "react";
import { MdErrorOutline } from "react-icons/md";
import { useGetShiftRequestSpecific } from "../api/get-shftt-request-by-id/hook";
import { useGetSubmittedShiftUserOne } from "../api/get-shift-submit-one/hook";
import { useSubmitShiftForm } from "../context/SubmitShiftFormContextProvider";

const FetchData = ({ children }: PropsWithChildren) => {
	const { setFormData, setShiftRequestData } = useSubmitShiftForm();
	const searchParams = useSearchParams();
	const shiftRequestId =
		searchParams.get("shiftRequestId") ?? searchParams.get("id");

	const {
		handleGetShiftRequestSpecific,
		isLoading: srLoading,
		error: srError,
	} = useGetShiftRequestSpecific();
	const {
		handleGetSubmitShiftUserOne,
		isLoading: ssLoading,
		error: ssError,
	} = useGetSubmittedShiftUserOne();

	const [ready, setReady] = useState(false);

	const getInitialShifts = useCallback((sr: ShiftRequestDTO) => {
		const shifts: Record<string, string | null> = {};
		const start = new Date(sr.weekStart);
		const end = new Date(sr.weekEnd);
		for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
			const dateStr = d.toISOString().slice(0, 10);
			const req = sr.requests[dateStr];
			shifts[dateStr] = req == null ? null : "anytime";
		}
		return shifts;
	}, []);

	useEffect(() => {
		let cancelled = false;
		(async () => {
			if (!shiftRequestId) return;

			const srRes = await handleGetShiftRequestSpecific({ shiftRequestId });
			if (!srRes.ok) {
				alert(
					"シフト情報の取得に失敗しました。時間をおいて再度お試しください。",
				);
				return;
			}
			if (cancelled) return;

			const fixDateFields = (sr: ShiftRequestDTO): ShiftRequestDTO => ({
				...sr,
				weekStart: new Date(sr.weekStart),
				weekEnd: new Date(sr.weekEnd),
				deadline: new Date(sr.deadline as Date),
				createdAt: new Date(sr.createdAt),
				updatedAt: new Date(sr.updatedAt),
			});
			setShiftRequestData(fixDateFields(srRes.shiftRequest));

			const ssRes = await handleGetSubmitShiftUserOne({ shiftRequestId });
			if (!ssRes.ok) {
				alert(
					"提出済みシフト情報の取得に失敗しました。時間をおいて再度お試しください。",
				);
				return;
			}
			if (cancelled) return;

			if (ssRes.submittedShift) {
				setFormData({
					shiftRequestId,
					status: ssRes.submittedShift.status,
					shifts: ssRes.submittedShift.shifts,
					memo: ssRes.submittedShift.memo || "",
				});
			} else {
				setFormData((prev) => ({
					...prev,
					shiftRequestId,
					shifts: getInitialShifts(srRes.shiftRequest),
				}));
			}

			setReady(true);
		})();
		return () => {
			cancelled = true;
		};
	}, [
		shiftRequestId,
		handleGetShiftRequestSpecific,
		handleGetSubmitShiftUserOne,
		setShiftRequestData,
		setFormData,
		getInitialShifts,
	]);

	if (!shiftRequestId || srLoading || ssLoading) {
		return (
			<main className="w-full h-lvh flex flex-col items-center bg-white">
				<p className="loading loading-spinner text-green02 mt-20" />
				<p className="text-green02 mt-2">データ取得中...</p>
			</main>
		);
	}

	if (srError || ssError) {
		const msg = srError ?? ssError ?? "不明なエラー";
		return (
			<main className="w-full h-lvh flex flex-col gap-2 items-center">
				<MdErrorOutline className="text-gray02 text-2xl mt-20" />
				<p className="text-gray02">認証/通信エラー</p>
				<p className="text-gray02">エラー: {msg}</p>
			</main>
		);
	}

	if (!ready) return null;
	return <>{children}</>;
};

export default FetchData;
