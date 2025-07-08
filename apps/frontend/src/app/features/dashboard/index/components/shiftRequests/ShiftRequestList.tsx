"use client";
import type { RootState } from "@/app/redux/store";
import React, { useMemo } from "react";
import { MdAdd } from "react-icons/md";
import { useSelector } from "react-redux";
import {
	DrawerView,
	type ShiftRequestWithJson,
	useBottomDrawer,
} from "../../../common/context/useBottomDrawer";
import ShiftRequestCard from "./ShiftRequestCard";

import { IoIosArrowDropleft, IoIosArrowDropright } from "react-icons/io";
import AddShiftButton from "../head/AddShiftButton";

const ShiftRequestList = () => {
	const shiftRequests = [
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
	// const { shiftRequests } = useSelector(
	//   (state: RootState) => state.shiftReuqests
	// );

	const showShiftRequests = useMemo(() => {
		if (user?.role === "STAFF") {
			return shiftRequests.filter((data) => data.status !== "HOLD");
		}
		return shiftRequests;
	}, [shiftRequests, user?.role]);

	const { darawerOpen } = useBottomDrawer();

	if (shiftRequests.length === 0) {
		return (
			<section className="w-11/12 mx-auto mt-7 border-2 border-dashed border-gray01 h-44 rounded-lg hover:bg-gray02">
				<button
					type="button"
					className="w-full flex flex-col gap-5 items-center justify-center h-full bg-green03"
					onClick={() => darawerOpen(DrawerView.CREATE_REQUEST, null)}
				>
					<h2 className="font-bold text-sm text-black opacity-60">
						シフトデータがありません。
					</h2>
					<div className="btn w-auto border-none h-7 rounded-full bg-green02 text-xs text-white font-bold">
						<MdAdd className="text-white font-bold" />
						シフト提出依頼を作成する
					</div>
				</button>
			</section>
		);
	}

	return (
		<section className="w-full h-auto mx-auto overflow-hidden">
			{/* <Head /> */}
			<div className="w-full mx-auto h-auto flex flex-col pt-5 shadow-sm bg-green02">
				<div className="w-full flex items-center justify-between mx-auto border-b-1 border-white pb-3 px-5">
					<IoIosArrowDropleft className="text-2xl text-white" />
					<p className="text-white  text-lg tracking-wide ">2025年 5月</p>
					<IoIosArrowDropright className="text-2xl text-white" />
				</div>
				{user?.role !== "STAFF" && (
					<div className="w-full mx-auto px-3 py-2 flex">
						<AddShiftButton />
					</div>
				)}
			</div>
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
