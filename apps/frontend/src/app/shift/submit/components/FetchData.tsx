"use client";
import type { ShiftRequestDTO } from "@shared/api/shift/request/dto";
import { set } from "date-fns";
import { type PropsWithChildren, use, useCallback, useEffect } from "react";
import { MdErrorOutline } from "react-icons/md";
import { useGetShiftRequestSpecific } from "../api/get-shftt-request-by-id/hook";
import { useGetSubmittedShiftUserOne } from "../api/get-shift-submit-one/hook";
import { useSubmitShiftForm } from "../context/SubmitShiftFormContextProvider";

const FetchData = ({
	shiftRequestId,
	children,
}: { shiftRequestId: string } & PropsWithChildren) => {
	const { setFormData, setShiftRequestData } = useSubmitShiftForm();
	const {
		handleGetShiftRequestSpecific,
		isLoading: srLoading,
		error: srError,
	} = useGetShiftRequestSpecific();
	const {
		handleGetSubmitShiftUserOne,
		isLoading: ssloading,
		error: ssError,
	} = useGetSubmittedShiftUserOne();

	const getInitialShifts = useCallback((shiftRequestData: ShiftRequestDTO) => {
		const shifts: Record<string, string | null> = {};
		const start = new Date(shiftRequestData.weekStart);
		const end = new Date(shiftRequestData.weekEnd);
		for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
			const dateStr = d.toISOString().slice(0, 10);
			const req = shiftRequestData.requests[dateStr];
			shifts[dateStr] = req == null ? null : "anytime"; // 定休日→null / それ以外→"anytime"
		}
		return shifts;
	}, []);

	useEffect(() => {
		async function fetchData() {
			if (!shiftRequestId) return;
			const srRes = await handleGetShiftRequestSpecific({ shiftRequestId });
			if (!srRes.ok) {
				alert(
					"シフト情報の取得に失敗しました。時間をおいて再度お試しください。",
				);
				return;
			}
			setShiftRequestData(srRes.shiftRequest);
			const ssRes = await handleGetSubmitShiftUserOne({ shiftRequestId });
			if (!ssRes.ok) {
				alert(
					"提出済みシフト情報の取得に失敗しました。時間をおいて再度お試しください。",
				);
				return;
			}
			if (ssRes.ok && ssRes.submittedShift !== null) {
				setFormData({
					shiftRequestId: shiftRequestId,
					status: ssRes.submittedShift.status,
					shifts: ssRes.submittedShift.shifts,
					memo: ssRes.submittedShift.memo || "",
				});
			} else {
				setFormData((prev) => ({
					...prev,
					shiftRequestId: shiftRequestId,
					shifts: getInitialShifts(srRes.shiftRequest),
				}));
			}
		}
		fetchData();
	}, [
		handleGetShiftRequestSpecific,
		handleGetSubmitShiftUserOne,
		shiftRequestId,
		setFormData,
		setShiftRequestData,
		getInitialShifts,
	]);

	if (srLoading || ssloading) {
		return (
			<main className="w-full h-lvh flex flex-col items-center bg-white">
				<p className="loading loading-spinner text-green02 mt-20" />
				<p className="text-green02 mt-2">データ取得中...</p>
			</main>
		);
	}

	if (srError) {
		return (
			<main className="w-full h-lvh flex flex-col gap-2 items-center">
				<MdErrorOutline className="text-gray02 text-2xl mt-20" />
				<p className="text-gray02">認証エラー</p>
				<p className="text-gray02">エラー: {srError}</p>
			</main>
		);
	}

	if (ssError) {
		return (
			<main className="w-full h-lvh flex flex-col gap-2 items-center">
				<MdErrorOutline className="text-gray02 text-2xl mt-20" />
				<p className="text-gray02">認証エラー</p>
				<p className="text-gray02">エラー: {ssError}</p>
			</main>
		);
	}

	return <>{children}</>;
};

export default FetchData;
