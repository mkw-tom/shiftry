import type { RootState } from "@/redux/store";
import type { RequestStatus } from "@shared/api/common/types/prisma";
import Link from "next/link";
import type { Dispatch, SetStateAction } from "react";
import { MdOutlineArrowOutward } from "react-icons/md";
import { useSelector } from "react-redux";
import AddShiftButton from "../AddShiftButton";

const ShiftRequestsListHead = ({
	setShiftListFilter,
}: {
	setShiftListFilter: Dispatch<SetStateAction<RequestStatus | "ALL">>;
}) => {
	const { user } = useSelector((state: RootState) => state.user);

	return (
		<div className="w-full mx-auto h-auto flex flex-col pt-5 shadow-sm bg-green02">
			<div className="w-full flex items-center justify-between mx-auto border-b-1 border-white pb-3 px-5">
				<div className="flex items-center flex-1 gap-2">
					<span className="text-sm text-white">表示：</span>
					<select
						defaultValue="ALL"
						className="select select-sm bg-base shadow-none w-32 font-bold border-gray-300 text-green02 "
						onChange={(e) =>
							setShiftListFilter(e.target.value as RequestStatus)
						}
					>
						<option disabled={true}>絞り込みを選択</option>
						<option value="ALL">すべて</option>
						<option value="CONFIRMED">確定</option>
						<option value="ADJUSTMENT">調整中</option>
						<option value="REQUEST">提出期間中</option>
						{user?.role !== "STAFF" && <option value="HOLD">下書き</option>}
					</select>
				</div>
				<Link
					href={"/dashboard/archive"}
					className="flex items-center gap-1 text-white tracking-wide text-sm"
				>
					<span>過去の履歴</span>
					<MdOutlineArrowOutward className="text-lg" />
				</Link>
			</div>
			{/* {user?.role === "OWNER" && ( */}
			<div className="w-full mx-auto px-2 py-2 flex">
				<AddShiftButton />
			</div>
			{/* )} */}
		</div>
	);
};

export default ShiftRequestsListHead;
