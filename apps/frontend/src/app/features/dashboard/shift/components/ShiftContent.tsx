"use client";
import { useGetAssignShift } from "@/app/features/dashboard/shift/api/get-assign-shift/hook";
import type { RootState } from "@/app/redux/store";
import type {
	AssignShiftWithJson,
	ShiftRequestWithJson,
} from "@shared/api/common/types/merged";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Head from "./Head";
import ShiftButtons from "./ShiftButtons";
import ShiftTable from "./ShiftTable";

const ShiftContent = () => {
	const { id } = useParams();
	const [assignShift, setAssignShift] = useState<AssignShiftWithJson | null>(
		null,
	);
	const { handleGetAssignShift, isLoading, error } = useGetAssignShift();
	const { activeShiftRequests } = useSelector(
		(state: RootState) => state.activeShiftReuqests,
	);

	const shiftRequest = activeShiftRequests.find((data) => data.id === id) as
		| ShiftRequestWithJson
		| undefined;

	// 🧱 nullチェック（先に返す）
	if (!shiftRequest) {
		return (
			<div className="text-center text-red-500 mt-10">
				shiftRequestが見つかりませんでした
			</div>
		);
	}

	function getDatesArray(
		weekStart: Date,
		weekEnd: Date,
	): { label: string; key: string }[] {
		const daysOfWeek = ["日", "月", "火", "水", "木", "金", "土"];
		const result = [];
		const current = new Date(weekStart);

		while (current <= weekEnd) {
			const y = current.getFullYear();
			const m = current.getMonth() + 1;
			const d = current.getDate();
			const w = daysOfWeek[current.getDay()];
			const key = `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
			const label = `${m}/${d}(${w})`;
			result.push({ label, key });
			current.setDate(current.getDate() + 1);
		}
		return result;
	}

	const [tableSlice, setTableSlice] = useState<{ start: number; end: number }>({
		start: 0,
		end: 7,
	});

	// ✅ Date変換（string対策）
	const dates = getDatesArray(
		new Date(shiftRequest.weekStart),
		new Date(shiftRequest.weekEnd as Date),
	);

	// ✅ dates.length を超えないようにslice
	const slicedDates = dates.slice(
		tableSlice.start,
		Math.min(tableSlice.end, dates.length),
	);

	useEffect(() => {
		const fetchAssignShift = async () => {
			const res = await handleGetAssignShift({
				shiftRequestId: id as string,
			});
			if (res?.ok) {
				setAssignShift(res.assignShift as AssignShiftWithJson);
			}
		};
		fetchAssignShift();
	}, [handleGetAssignShift, id]);

	// ✅ 描画分岐
	if (isLoading) return <div className="text-center mt-10">Loading...</div>;
	if (error)
		return <div className="text-center text-red-500 mt-10">Error: {error}</div>;
	if (!assignShift)
		return (
			<div className="text-center text-gray-500 mt-10">
				シフトデータが取得できませんでした
			</div>
		);

	return (
		<main className="bg-white w-full h-lvh mt-12">
			<div className="w-full h-full pt-4 flex flex-col items-center gap-5">
				<Head
					dates={dates}
					tableSlice={tableSlice}
					setTableSlice={setTableSlice}
				/>
				<ShiftTable
					dates={slicedDates}
					assignShift={assignShift}
					shiftRequest={shiftRequest}
					setAssignShift={setAssignShift}
				/>
			</div>
			<ShiftButtons status={assignShift.status} />
		</main>
	);
};

export default ShiftContent;
