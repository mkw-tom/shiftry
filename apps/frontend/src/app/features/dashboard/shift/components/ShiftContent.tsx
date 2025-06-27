"use client";
import { getAssignShift } from "@/app/features/dashboard/shift/api/get-assign-shift/api";
import { useGetAssignShift } from "@/app/features/dashboard/shift/api/get-assign-shift/hook";
import type { RootState } from "@/app/redux/store";
import type { AssignShift, ShiftRequest } from "@shared/common/types/prisma";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Head from "./Head";

import type { ShiftsOfAssignType } from "@shared/common/types/json";
import type { ShiftsOfRequestsType } from "@shared/common/types/json";
import type {
	AssignShiftWithJson,
	ShiftRequestWithJson,
} from "@shared/common/types/merged";
import ShiftButtons from "./ShiftButtons";
import ShiftTable from "./ShiftTable";

export const dummyAssignShift: AssignShiftWithJson = {
	id: "4",
	createdAt: new Date(),
	updatedAt: new Date(),
	storeId: "4",
	status: "ADJUSTMENT",
	shiftRequestId: "4",
	shifts: [
		{
			userId: "user-001",
			userName: "たろう",
			shifts: [
				{ date: "2025-04-15", time: "09:00-13:00" },
				{ date: "2025-04-16", time: "14:00-18:00" },
			],
		},
		{
			userId: "user-002",
			userName: "じろう",
			shifts: [
				{ date: "2025-04-15", time: "10:00-14:00" },
				{ date: "2025-04-17", time: "12:00-16:00" },
				{ date: "2025-04-18", time: "09:00-12:00" },
			],
		},
		{
			userId: "user-003",
			userName: "すけどう",
			shifts: [{ date: "2025-04-15", time: "10:00-14:00" }],
		},
		{
			userId: "user-004",
			userName: "さぶろう",
			shifts: [{ date: "2025-04-15", time: "10:00-14:00" }],
		},
	],
};

const ShiftContent = () => {
	const { id } = useParams();
	const { userToken, storeToken } = useSelector(
		(state: RootState) => state.token,
	);
	const [assignShift, setAssignShift] =
		useState<AssignShiftWithJson>(dummyAssignShift);
	const { handleGetAssignShift, isLoading, error } = useGetAssignShift();
	const shiftRequest: ShiftRequestWithJson = {
		id: "4",
		createdAt: new Date(),
		updatedAt: new Date(),
		storeId: "4",
		type: "MONTHLY",
		status: "CONFIRMED",
		weekStart: new Date("2025-03-31"),
		weekEnd: new Date("2025-04-28"),
		requests: [
			{
				overrideDates: {
					"2025-04-10": ["08:00-12:00*1"],
					"2025-04-14": [],
				},
				defaultTimePositions: {
					Monday: ["09:00-13:00*1", "14:00-18:00*1", "19:00-23:00*1"],
					Tuesday: ["10:00-14:00*1", "15:00-19:00*1", "20:00-23:00*1"],
					Wednesday: ["10:00-14:00*1", "15:00-19:00*1", "20:00-23:00*1"],
					Thursday: ["10:00-14:00*1", "15:00-19:00*1", "20:00-23:00*1"],
					Friday: ["10:00-14:00*1", "15:00-19:00*1", "20:00-23:00*1"],
					Saturday: [],
					Sunday: [],
				},
			},
		],
		deadline: new Date("2025-05-06"),
	};

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
	const dates = getDatesArray(
		shiftRequest.weekStart as Date,
		shiftRequest.weekEnd as Date,
	);
	const slicedDates = dates.slice(tableSlice.start, tableSlice.end);

	// useEffect(() => {
	//     const fetchAssignShift = async () => {
	//         if(!userToken || !storeToken)  return
	//         const res = await handleGetAssignShift({
	//             userToken,
	//             storeToken,
	//             shiftRequestId: id as string,
	//         })
	//         if(res?.ok) {
	//             setAssignShift(res?.assignShift)
	//         }
	//     }
	//     fetchAssignShift();
	// }, [])
	// if(isLoading) return <div>Loading...</div>
	// if(error) return <div>Error: {error}</div>

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
