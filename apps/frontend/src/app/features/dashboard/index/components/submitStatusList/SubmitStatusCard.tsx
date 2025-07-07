import { MDW, YMDHM, YMDW } from "@/app/features/common/hooks/useFormatDate";
import type { ShiftStatus } from "@shared/api/common/types/prisma";
import React, { type JSX } from "react";
import { BiCheck } from "react-icons/bi";
import { LuSend } from "react-icons/lu";
import {
	DrawerView,
	type ShiftRequestWithJson,
	useBottomDrawer,
} from "../../../common/context/useBottomDrawer";

const statusBadgeMap: Record<
	ShiftStatus,
	{ text: string; colorClass: string; icon: JSX.Element }
> = {
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

const SubmitStatusCard = ({ data }: { data: ShiftRequestWithJson }) => {
	// const { text, colorClass, icon } = statusBadgeMap[data.status] ?? {
	//   text: "不明",
	//   colorClass: "bg-gray-400",
	// };
	const { darawerOpen } = useBottomDrawer();

	return (
		<li
			key={data.id}
			className="bg-white h-auto w-full p-4 border-b-1 border-b-gray01 py-6 "
		>
			<div className="flex justify-between items-center">
				{/* <div
          className={`badge badge-sm bg-gray02 text-white  rounded-full font-bold text-[11px] px-3 border-none flex items-center`}
        >
          <FaRegEdit />
					<span>未提出</span>
        </div> */}
				<div
					className={
						"badge badge-sm bg-green01 text-white  rounded-full font-bold text-[11px] px-3 border-none flex items-center"
					}
				>
					<LuSend />
					<span>提出済み</span>
				</div>
				<p className="text-xs text-gray02 tracking-wide">
					更新：{YMDHM(new Date(data.updatedAt))}
				</p>
			</div>
			<div className="w-full flex items-center justify-between">
				<div className="flex-1">
					<h2 className="w-full text-left mt-4 text-black font-bold  opacity-90 tracking-wide pl-1">
						{YMDW(new Date(data.weekStart))} ~{" "}
						{MDW(new Date(data.weekEnd as Date))}
					</h2>
					<p className="w-full text-left text-error text-xs pt-1 pl-1 tracking-wide">
						提出期限：{YMDHM(new Date(data.deadline as Date))}
					</p>
				</div>
				<button
					type="button"
					className="btn btn-sm border-green02 text-green02 bg-white"
					onClick={() => darawerOpen(DrawerView.SUBMIT, data)}
				>
					<LuSend />
					再提出
				</button>
			</div>
		</li>
	);
};

export default SubmitStatusCard;
