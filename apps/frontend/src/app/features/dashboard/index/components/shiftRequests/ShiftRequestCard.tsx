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
	HOLD: { text: "下書き", colorClass: "bg-gray02" },
	REQUEST: { text: "提出期間中", colorClass: "bg-green01" },
	ADJUSTMENT: { text: "調整中", colorClass: "bg-blue01" },
	CONFIRMED: { text: "確定", colorClass: "bg-orange-400" },
};

const ShiftRequestCard = ({ data }: { data: ShiftRequestWithJson }) => {
	const { text, colorClass } = statusBadgeMap[data.status] ?? {
		text: "不明",
		colorClass: "bg-gray-400",
	};

	return (
		<li
			key={data.id}
			className="bg-white h-auto w-full rounded-xl p-4 shadow-md"
		>
			<div className="flex justify-between items-center">
				<div
					className={`badge badge-sm ${colorClass} text-white rounded-full font-bold text-[10px] w-18 border-none`}
				>
					{text}
				</div>
				<p className="text-xs text-gray02">
					更新：{YMDHM(new Date(data.updatedAt))}
				</p>
			</div>
			<h2 className="w-full text-left mt-5 text-black font-bold border-b border-gray01 pl-1">
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
