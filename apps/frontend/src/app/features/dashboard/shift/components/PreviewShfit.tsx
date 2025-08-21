// import type { RootState } from "@/app/redux/store";
// import type {
// 	AssignShiftWithJson,
// 	ShiftRequestWithJson,
// } from "@shared/api/common/types/merged";
// import type { ParamValue } from "next/dist/server/request/params";
// import React, { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import { useGetAssignShift } from "../api/get-assign-shift/hook";
// import ShiftButtons from "./ShiftButtons";
// import { dummy } from "./ShiftContent";
// import ShiftTable from "./ShiftTable";
// import ShiftTableHead from "./ShiftTableHead";

// const PreviewShfit = ({
// 	id,
// 	assingShiftByAI,
// }: {
// 	id: ParamValue;
// 	assingShiftByAI: AssignShiftWithJson | null;
// }) => {
// 	const [assignShift, setAssignShift] = useState<AssignShiftWithJson | null>(
// 		null,
// 	);
// 	const { handleGetAssignShift, isLoading, error } = useGetAssignShift();
// 	const { activeShiftRequests } = useSelector(
// 		(state: RootState) => state.activeShiftRequests,
// 	);

// 	// const shiftRequest = activeShiftRequests.find((data) => data.id === id) as ShiftRequestWithJson;

// 	// 開発用ダミーデータ（shfitRequst）
// 	const shiftRequest = {
// 		id: "4",
// 		createdAt: new Date(),
// 		updatedAt: new Date(),
// 		storeId: "4",
// 		type: "MONTHLY",
// 		status: "CONFIRMED",
// 		weekStart: new Date("2025-05-01"),
// 		weekEnd: new Date("2025-05-30"),
// 		requests: {
// 			overrideDates: {
// 				"2025-04-10": ["08:00-12:00"],
// 				"2025-04-14": [],
// 			},
// 			defaultTimePositions: {
// 				Friday: ["10:00-14:00", "15:00-19:00", "20:00-23:00"],
// 				Monday: ["09:00-13:00", "14:00-18:00", "19:00-23:00"],
// 				Sunday: [],
// 				Tuesday: ["10:00-14:00", "15:00-19:00", "20:00-23:00"],
// 				Saturday: [],
// 				Thursday: ["10:00-14:00", "15:00-19:00", "20:00-23:00"],
// 				Wednesday: ["10:00-14:00", "15:00-19:00", "20:00-23:00"],
// 			},
// 		},
// 		deadline: new Date("2025-05-06"),
// 	} as ShiftRequestWithJson;

// 	// 🧱 nullチェック（先に返す）
// 	if (!shiftRequest) {
// 		return (
// 			<div className="text-center text-red-500 mt-10">
// 				shiftRequestが見つかりませんでした
// 			</div>
// 		);
// 	}

// 	function getDatesArray(
// 		weekStart: Date,
// 		weekEnd: Date,
// 	): { label: string; key: string }[] {
// 		const daysOfWeek = ["日", "月", "火", "水", "木", "金", "土"];
// 		const result = [];
// 		const current = new Date(weekStart);

// 		while (current <= weekEnd) {
// 			const y = current.getFullYear();
// 			const m = current.getMonth() + 1;
// 			const d = current.getDate();
// 			const w = daysOfWeek[current.getDay()];
// 			const key = `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(
// 				2,
// 				"0",
// 			)}`;
// 			const label = `${m}/${d}(${w})`;
// 			result.push({ label, key });
// 			current.setDate(current.getDate() + 1);
// 		}
// 		return result;
// 	}

// 	const [tableSlice, setTableSlice] = useState<{ start: number; end: number }>({
// 		start: 0,
// 		end: 7,
// 	});

// 	// ✅ Date変換（string対策）
// 	const dates = getDatesArray(
// 		new Date(shiftRequest.weekStart),
// 		new Date(shiftRequest.weekEnd as Date),
// 	);

// 	// ✅ dates.length を超えないようにslice
// 	const slicedDates = dates.slice(
// 		tableSlice.start,
// 		Math.min(tableSlice.end, dates.length),
// 	);

// 	useEffect(() => {
// 		if (assingShiftByAI) {
// 			return setAssignShift(assingShiftByAI);
// 		}

// 		const fetchAssignShift = async () => {
// 			const res = await handleGetAssignShift({
// 				shiftRequestId: id as string,
// 			});
// 			if (res?.ok) {
// 				setAssignShift(res.assignShift as AssignShiftWithJson);
// 			}
// 		};
// 		const test = () => {
// 			setAssignShift(dummy);
// 		};
// 		// fetchAssignShift();

// 		///開発用データ取得関数
// 		test();
// 	}, [handleGetAssignShift, id, assingShiftByAI]);

// 	// ✅ 描画分岐
// 	if (isLoading) return <div className="text-center mt-10">Loading...</div>;

// 	if (error)
// 		return <div className="text-center text-red-500 mt-10">Error: {error}</div>;

// 	if (!assignShift)
// 		return (
// 			<div className="text-center text-gray-500 mt-16">
// 				シフトデータが取得できませんでした
// 			</div>
// 		);
// 	return (
// 		<div className="w-full h-full pt-10 flex flex-col items-center gap-5 transition-all duration-300 ">
// 			<ShiftTableHead
// 				dates={dates}
// 				tableSlice={tableSlice}
// 				setTableSlice={setTableSlice}
// 			/>
// 			<ShiftTable
// 				dates={slicedDates}
// 				assignShift={assignShift}
// 				shiftRequest={shiftRequest}
// 				setAssignShift={setAssignShift}
// 			/>
// 			{assingShiftByAI ? (
// 				<div className="fixed bottom-0 right-0 left-0 w-full flex justify-between  gap-2 z-30 mx-auto bg-black">
// 					<div className="w-full h-full mb-10 mt-5 shadow-xl">
// 						<button
// 							type="submit"
// 							className="w-11/12 mx-auto btn rounded-md bg-green01 text-white border-none flex items-center gap-2  shadow-md"
// 						>
// 							<span className="mr-2">この調整を反映</span>
// 						</button>
// 					</div>
// 				</div>
// 			) : (
// 				<ShiftButtons status={assignShift.status} />
// 			)}
// 		</div>
// 	);
// };

// export default PreviewShfit;
