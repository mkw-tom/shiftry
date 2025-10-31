import type { RootState } from "@/redux/store";
import type { ShiftRequestDTO } from "@shared/api/shift/request/dto";
import { MDW, YMDHM, YMDW } from "@shared/utils/formatDate";
import React from "react";
import { useSelector } from "react-redux";

const ArchiveListCard = ({
	data,
	handleCheck,
}: {
	data: ShiftRequestDTO;
	handleCheck: (id: string, checked: boolean) => void;
}) => {
	const { user } = useSelector((state: RootState) => state.user);

	return (
		<li
			key={data.id}
			className="flex items-center justify-start w-full h-auto p-4 border-b border-gray01"
		>
			{user?.role !== "STAFF" && (
				<input
					type="checkbox"
					className="checkbox checkbox-sm checkbox-success mr-4"
					onChange={(e) => handleCheck(data.id, e.target.checked)}
				/>
			)}
			<div className="flex flex-col gap-1 items-start flex-1">
				<p className="text-black opacity-70 tracking-wide">
					{YMDW(new Date(data.weekStart))} ~{" "}
					{MDW(new Date(data.weekEnd as Date))}
				</p>
				<p className="text-xs text-gray02 tracking-wide">
					更新：{YMDHM(new Date(data.updatedAt))}
				</p>
			</div>
			<button
				type="button"
				className="btn btn-sm border-green02 text-green02 bg-white shadow-none"
				// onClick={() => darawerOpen(DrawerView.SUBMIT, data)}
			>
				開く
			</button>
		</li>
	);
};

export default ArchiveListCard;
