"use client";
import type { RootState } from "@/app/redux/store";
import React, { useMemo, useState } from "react";
import { MdAdd } from "react-icons/md";
import { useSelector } from "react-redux";
import {
	DrawerView,
	type ShiftRequestWithJson,
	useBottomDrawer,
} from "../../../common/context/useBottomDrawer";
import ShiftRequestCard from "./ShiftRequestCard";

import type { RequestStatus } from "@shared/api/common/types/prisma";
import { IoIosArrowDropleft, IoIosArrowDropright } from "react-icons/io";
import { LuSend } from "react-icons/lu";
import AddShiftButton from "../head/AddShiftButton";
import ShiftRequestsListHead from "./ShiftRequestsListHead";

const ShiftRequestList = () => {
	const [shfitListFilter, setShiftListFilter] = useState<RequestStatus | "ALL">(
		"ALL",
	);

	const activeShiftRequests = [
		{
			id: "1",
			createdAt: new Date(),
			updatedAt: new Date(),
			storeId: "1",
			type: "SHIFT",
			status: "ADJUSTMENT",
			weekStart: new Date("2025-05-01"),
			weekEnd: new Date("2025-05-07"),
			requests: {
				overrideDates: {
					"2025-04-10": ["08:00-12:00"],
					"2025-04-14": [],
				},
				defaultTimePositions: {
					Friday: ["10:00-14:00", "15:00-19:00", "20:00-23:00"],
					Monday: ["09:00-13:00", "14:00-18:00", "19:00-23:00"],
					Sunday: ["10:00-14:00", "15:00-19:00", "20:00-23:00"],
					Tuesday: ["10:00-14:00", "15:00-19:00", "20:00-23:00"],
					Saturday: ["10:00-14:00", "15:00-19:00", "20:00-23:00"],
					Thursday: [],
					Wednesday: [],
				},
			},
			deadline: new Date("2025-04-29"),
		},
		{
			id: "2",
			createdAt: new Date(),
			updatedAt: new Date(),
			storeId: "2",
			type: "SHIFT",
			status: "HOLD",
			weekStart: new Date("2025-05-08"),
			weekEnd: new Date("2025-05-15"),
			requests: {
				overrideDates: {
					"2025-04-10": ["08:00-12:00"],
					"2025-04-14": [],
				},
				defaultTimePositions: {
					Friday: [],
					Monday: ["09:00-13:00"],
					Sunday: [],
					Tuesday: ["10:00-14:00"],
					Saturday: [],
					Thursday: [],
					Wednesday: [],
				},
			},
			deadline: new Date("2025-05-06"),
		},
		{
			id: "3",
			createdAt: new Date(),
			updatedAt: new Date(),
			storeId: "3",
			type: "SHIFT",
			status: "REQUEST",
			weekStart: new Date("2025-05-08"),
			weekEnd: new Date("2025-05-15"),
			requests: {
				overrideDates: {
					"2025-04-10": ["08:00-12:00"],
					"2025-04-14": [],
				},
				defaultTimePositions: {
					Friday: [],
					Monday: ["09:00-13:00"],
					Sunday: [],
					Tuesday: ["10:00-14:00"],
					Saturday: [],
					Thursday: [],
					Wednesday: [],
				},
			},
			deadline: new Date("2025-05-06"),
		},
		{
			id: "4",
			createdAt: new Date(),
			updatedAt: new Date(),
			storeId: "4",
			type: "SHIFT",
			status: "CONFIRMED",
			weekStart: new Date("2025-05-08"),
			weekEnd: new Date("2025-05-15"),
			requests: {
				overrideDates: {
					"2025-04-10": ["08:00-12:00"],
					"2025-04-14": [],
				},
				defaultTimePositions: {
					Friday: ["10:00-14:00", "15:00-19:00", "20:00-23:00"],
					Monday: ["09:00-13:00", "14:00-18:00", "19:00-23:00"],
					Sunday: [],
					Tuesday: ["10:00-14:00", "15:00-19:00", "20:00-23:00"],
					Saturday: [],
					Thursday: ["10:00-14:00", "15:00-19:00", "20:00-23:00"],
					Wednesday: ["10:00-14:00", "15:00-19:00", "20:00-23:00"],
				},
			},
			deadline: new Date("2025-05-06"),
		},
	] as unknown as ShiftRequestWithJson[];
	const { user } = useSelector((state: RootState) => state.user);
	// const { activeShiftRequests } = useSelector(
	// 	(state: RootState) => state.activeShiftReuqests,
	// );

	const filteredShiftRequests = useMemo(() => {
		if (shfitListFilter === "ALL") return activeShiftRequests;
		return activeShiftRequests.filter(
			(data) => data.status === shfitListFilter,
		);
	}, [shfitListFilter, activeShiftRequests]);

	const showShiftRequests =
		user?.role === "STAFF"
			? filteredShiftRequests.filter((data) => data.status !== "HOLD")
			: filteredShiftRequests;

	const { darawerOpen } = useBottomDrawer();

	if (activeShiftRequests.length === 0) {
		return (
			<section className="w-full h-auto mx-auto">
				<ShiftRequestsListHead setShiftListFilter={setShiftListFilter} />
				{user?.role !== "STAFF" ? (
					<div className="w-11/12 mx-auto mt-7 border-2 border-dashed border-gray01 h-50 rounded-md hover:bg-gray02">
						<button
							type="button"
							className="w-full flex flex-col gap-5 items-center justify-center h-full"
							onClick={() => darawerOpen(DrawerView.CREATE_REQUEST, null)}
						>
							<div className="w-full flex flex-col items-center gap-2 mt-5">
								<LuSend className="text-center text-gray02 font-bold text-2xl" />
								<p className="text-center text-gray02 font-bold tracking-wide">
									データが存在しません
								</p>
							</div>

							<div className="btn w-auto border-none h-7 rounded-md bg-green02 text-xs text-white font-bold shadow-md">
								<MdAdd className="text-white. font-bold" />
								シフト提出依頼を作成する
							</div>
						</button>
					</div>
				) : (
					<div className="w-full flex flex-col items-center gap-2 mt-20">
						<LuSend className="text-center text-gray02 font-bold text-2xl" />
						<p className="text-center text-gray02 font-bold tracking-wide">
							データが存在しません
						</p>
					</div>
				)}
			</section>
		);
	}

	return (
		<section className="w-full h-auto mx-auto overflow-hidden">
			{/* <Head /> */}
			<ShiftRequestsListHead setShiftListFilter={setShiftListFilter} />
			<div className="w-full h-full overflow-hidden bg-white mt-1">
				<ul className="w-full h-[420px] mx-auto flex flex-col overflow-y-scroll pt-1 pb-80 ">
					{showShiftRequests.map((data) => (
						<ShiftRequestCard
							key={data.id}
							data={data as ShiftRequestWithJson}
						/>
					))}
				</ul>
			</div>
		</section>
	);
};

export default ShiftRequestList;
