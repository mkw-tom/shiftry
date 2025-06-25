import { MDW, YMDHM, YMDW } from "@/app/features/common/hooks/useFormatDate";
import type { ShiftRequest } from "@shared/common/types/prisma";
import type { RequestStatus } from "@shared/common/types/prisma";
import React from "react";
import type { ShiftRequestWithJson } from "../../../common/context/useBottomDrawer";
import ActionButtons from "./ActionButtons";

const statusBadgeMap: Record<
	RequestStatus,
	{ text: string; colorClass: string }
> = {
	HOLD: { text: "下書き", colorClass: "bg-gray02 text-white" },
	REQUEST: { text: "提出期間中", colorClass: "bg-green01 text-white" },
	ADJUSTMENT: { text: "調整中", colorClass: "bg-green01 text-white" },
	CONFIRMED: { text: "確定", colorClass: "bg-green02 text-white" },
};

const ShiftRequestCard = ({ data }: { data: ShiftRequestWithJson }) => {
	const { text, colorClass } = statusBadgeMap[data.status] ?? {
		text: "不明",
		colorClass: "bg-gray-400",
	};

	return (
		<li
			key={data.id}
			className="bg-gray-100 h-auto w-full rounded-sm p-4 shadow-md"
		>
			<div className="flex justify-between items-center">
				<div
					className={`badge badge-sm ${colorClass}  rounded-full font-bold text-[10px] w-20 border-none`}
				>
					{data.status === "ADJUSTMENT" && (
						<div className="loading loading-xs loading-bars" />
					)}
					{text}
				</div>
				<p className="text-xs text-gray02">
					更新：{YMDHM(new Date(data.updatedAt))}
				</p>
			</div>
			<h2 className="w-full text-left text-lg mt-4 text-black font-bold border-b border-gray01 pl-1">
				{YMDW(new Date(data.weekStart))} ~ {MDW(new Date(data.weekEnd as Date))}
			</h2>
			<p className="w-full text-left text-error text-xs font-bold pt-0.5 pl-1">
				提出期限：{YMDHM(new Date(data.deadline as Date))}
			</p>
			<div className="mt-3 flex items-center justify-end gap-2">
				<ActionButtons status={data.status} data={data} />
			</div>
		</li>
	);
};

export default ShiftRequestCard;
