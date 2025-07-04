import type { shiftsOfSubmittedType } from "@shared/common/types/json";
import { SubmittedShiftWithJson } from "@shared/common/types/merged";
import { ShiftStatus, type SubmittedShift } from "@shared/common/types/prisma";
import React, { useEffect } from "react";
import { useGenareteShift } from "../../../context/useGenerateShift";
import SubmittedShiftListModal from "./SubmittedShiftListModal";

export type DayOfWeekType =
	| "Monday"
	| "Tuesday"
	| "Wednesday"
	| "Thursday"
	| "Friday"
	| "Saturday"
	| "Sunday";

// const submittedShifts: SubmittedShiftWithJson[] = [
// 	{
// 		id: "subm-12345678-abcd-efgh-ijkl-9876543210ab",
// 		userId: "user-abcdefg123",
// 		storeId: "store-xyz9876",
// 		shiftRequestId: "req-55667788",
// 		status: ShiftStatus.ADJUSTMENT,
// 		shifts: {
// 			name: "マエカワ",
// 			weekCountMin: 2,
// 			weekCountMax: 3,
// 			availableWeeks: ["Monday&10:00-17:00", "Wednesday", "Friday&10:00-17:00"],
// 			specificDates: [
// 				"2025-11-10&14:00-18:00", // この日は午後のみOK
// 				"2025-11-12", // この日は終日OK
// 				"2025-11-14&10:00-15:00", // 15時までOK（午後は不可）
// 			],
// 		},
// 		createdAt: new Date("2025-06-07T12:00:00Z"),
// 		updatedAt: new Date("2025-06-07T12:00:00Z"),
// 	},
// 	{
// 		id: "subm-12345678-abcd-efgh-ghaiohhaheiwhgahigahha;g",
// 		userId: "user-abcdefg123",
// 		storeId: "store-xyz9876",
// 		shiftRequestId: "req-55667788",
// 		status: ShiftStatus.ADJUSTMENT,
// 		shifts: {
// 			name: "チヒロ",
// 			weekCountMin: 2,
// 			weekCountMax: 3,
// 			availableWeeks: ["Monday&10:00-17:00", "Wednesday", "Friday&10:00-17:00"],
// 			specificDates: [],
// 		},
// 		createdAt: new Date("2025-06-07T12:00:00Z"),
// 		updatedAt: new Date("2025-06-07T12:00:00Z"),
// 	},
// ];

const SubmittedShiftList = () => {
	const { submittedDatas } = useGenareteShift();
	const { submittedShifts } = submittedDatas;
	return (
		<ul className="flex flex-col">
			{submittedShifts.map((data) => (
				<li
					key={data.id}
					className="flex items-center justify-between py-4 px-2 border-b border-gray01"
				>
					<div className="flex flex-col items-start gap-2 w-full">
						<div className=" flex items-center w-full gap-2">
							<div className="w-7 h-7 bg-gray01 rounded-full" />
							<span className="text-sm  text-black">{data.shifts.name}</span>
						</div>
						<div className="flex items-center gap-5 pl-1">
							<span className="text-xs text-gray02">
								出勤：週{data.shifts.weekCountMin}回～{data.shifts.weekCountMax}
								回
							</span>
							{/* <span className="text-xs text-gray02 text-black">出勤回数（週）：{data.shifts.weekCountMin}回～{data.shifts.weekCountMax}回</span> */}
							<span
								className={`text-xs ${
									data.shifts.specificDates.length > 0
										? "text-green01"
										: "text-gray02"
								}`}
							>
								特定日の希望：
								{data.shifts.specificDates.length > 0 ? "あり" : "なし"}
							</span>
						</div>
					</div>
					<SubmittedShiftListModal data={data} />
				</li>
			))}
		</ul>
	);
};

export default SubmittedShiftList;
