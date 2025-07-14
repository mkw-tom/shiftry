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
import Head from "../../common/components/Head";
import AdjustChatContent from "./AdjustChatContent";
import HeadSwitch from "./HeadSwitch";
import PreviewShfit from "./PreviewShfit";
import ShiftButtons from "./ShiftButtons";
import ShiftTable from "./ShiftTable";
import ShiftTableHead from "./ShiftTableHead";

// 開発用ダミーデータ（assingShift）
export const dummy = {
	id: "assign-001",
	shiftRequestId: "dymmy-1",
	status: "ADJUSTMENT",
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
	],
} as AssignShiftWithJson;

const ShiftContent = () => {
	const { id } = useParams();

	const [select, setSelect] = useState<"PREVIEW" | "CHAT">("PREVIEW");

	return (
		<main className="bg-white w-full h-lvh mt-10">
			<Head />
			<div className="sticky top-12 z-10 w-full h-auto mx-auto bg-white border-b-1 border-gray01">
				<HeadSwitch select={select} setSelect={setSelect} />
			</div>

			{/* PREVIEWモード */}
			<div className={` ${select === "PREVIEW" ? "" : "hidden"}`}>
				<PreviewShfit id={id} assingShiftByAI={null} />
			</div>

			{/* CHATモード */}
			<div className={`${select === "CHAT" ? "" : "hidden"}`}>
				<AdjustChatContent id={id} />
			</div>
		</main>
	);
};

export default ShiftContent;
