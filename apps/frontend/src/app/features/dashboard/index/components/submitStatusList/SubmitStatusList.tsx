import type { ShiftRequestWithJson } from "@shared/api/common/types/merged";
import React from "react";
import { LuSend } from "react-icons/lu";
import { useBottomDrawer } from "../../../common/context/useBottomDrawer";
import SubmitStatusCard from "./SubmitStatusCard";

const SubmitStatusList = () => {
	const shiftRequests: ShiftRequestWithJson[] = [
		{
			id: "1",
			createdAt: new Date(),
			updatedAt: new Date(),
			storeId: "1",
			type: "MONTHLY",
			status: "ADJUSTMENT",
			weekStart: new Date("2025-05-01"),
			weekEnd: new Date("2025-05-07"),
			requests: {
				defaultTimePositions: {
					Monday: ["09:00-13:00", "14:00-18:00", "19:00-23:00"],
					Tuesday: ["10:00-14:00", "15:00-19:00", "20:00-23:00"],
					Wednesday: [],
					Thursday: [],
					Friday: ["10:00-14:00", "15:00-19:00", "20:00-23:00"],
					Saturday: ["10:00-14:00", "15:00-19:00", "20:00-23:00"],
					Sunday: ["10:00-14:00", "15:00-19:00", "20:00-23:00"],
				},
				overrideDates: {
					"2025-04-10": ["08:00-12:00"],
					"2025-04-14": [],
				},
			},
			deadline: new Date("2025-04-29"),
		},
		{
			id: "2",
			createdAt: new Date(),
			updatedAt: new Date(),
			storeId: "2",
			type: "MONTHLY",
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
			type: "MONTHLY",
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
			type: "MONTHLY",
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
	];

	// const { shiftRequests } = useSelector(
	// 	(state: RootState) => state.shiftReuqests,
	// );
	const { darawerOpen } = useBottomDrawer();

	const shiftRequestsOfRequest = shiftRequests.filter(
		(data) => data.status === "REQUEST",
	);

	if (shiftRequestsOfRequest.length === 0) {
		return (
			<section className="w-11/12 mx-auto mt-7 border-2 border-dashed border-gray01 h-44 rounded-lg hover:bg-gray02">
				...シフトの提出依頼がありません。
			</section>
		);
	}

	return (
		<section className="w-full h-auto mx-auto overflow-hidden">
			{/* <Head /> */}
			<div className="w-full mx-auto h-auto flex flex-col pt-7 pb-3 shadow-sm bg-green02">
				<div className="w-full flex items-center justify-start mx-auto px-5 ">
					<h2 className="text-white tracking-wide flex items-center gap-3 text-center font-bold">
						<LuSend />
						<span>提出依頼：３件</span>
					</h2>
				</div>
			</div>
			<div className="w-full h-full overflow-hidden bg-white mt-1">
				<ul className="w-full h-[420px] mx-auto flex flex-col overflow-y-scroll pt-1 pb-80 ">
					{shiftRequestsOfRequest.map((data) => (
						<SubmitStatusCard
							key={data.id}
							data={data as ShiftRequestWithJson}
						/>
					))}
				</ul>
			</div>
		</section>
	);
};

export default SubmitStatusList;
