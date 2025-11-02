import type { RequestStatus } from "@shared/api/common/types/prisma";
import type { ShiftRequestDTO } from "@shared/api/shift/request/dto";
import { MDW, YMDHM, YMDW } from "@shared/utils/formatDate";
import React, { type JSX } from "react";
import { BiCheck, BiEditAlt } from "react-icons/bi";
import { LuSend } from "react-icons/lu";
import ActionButtons from "./ActionButtons";

const statusBadgeMap: Record<
	RequestStatus,
	{ text: string; colorClass: string; icon: JSX.Element }
> = {
	HOLD: {
		text: "下書き",
		colorClass: "bg-gray02 text-white",
		icon: <BiEditAlt />,
	},
	REQUEST: {
		text: "提出期間中",
		colorClass: "bg-green01 text-white",
		icon: <LuSend />,
	},
	ADJUSTMENT: {
		text: "調整中",
		colorClass: "bg-green01 text-white",
		icon: <div className="loading loading-bars loading-xs" />,
	},
	CONFIRMED: {
		text: "確定",
		colorClass: "bg-green02 text-white",
		icon: <BiCheck />,
	},
};

const ShiftRequestCard = ({ data }: { data: ShiftRequestDTO }) => {
	const { text, colorClass, icon } = statusBadgeMap[data.status] ?? {
		text: "不明",
		colorClass: "bg-gray-400",
	};

	return (
		<li
			key={data.id}
			className="bg-white h-auto w-full p-4 border-b-1 border-b-gray01 py-6 "
		>
			<div className="flex justify-between items-center">
				<div
					className={`badge badge-sm ${colorClass}  rounded-full font-bold text-[11px] px-3 border-none flex items-center`}
				>
					{icon}
					{text}
				</div>
				<p className="text-xs text-gray02 tracking-wide">
					更新：{YMDHM(new Date(data.updatedAt))}
				</p>
			</div>
			<h2 className="w-full text-left text-lg mt-4 text-black font-bold border-b border-gray01 pl- opacity-90 tracking-wide pl-1">
				{YMDW(new Date(data.weekStart))} ~ {MDW(new Date(data.weekEnd as Date))}
			</h2>
			{data.status !== "CONFIRMED" && (
				<p className="w-full text-left text-error text-xs pt-0.5 pl-1 tracking-wide">
					提出期限：{YMDHM(new Date(data.deadline as Date))}
				</p>
			)}
			<div className="mt-3 flex items-center justify-end gap-2">
				<ActionButtons status={data.status} data={data} />
			</div>
		</li>
	);
};

export default ShiftRequestCard;
