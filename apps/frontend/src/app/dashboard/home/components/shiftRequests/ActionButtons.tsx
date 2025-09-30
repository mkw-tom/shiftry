"use client";
import { liffId, liffUrl } from "@/lib/env";
import type { RootState } from "@/redux/store";
import type { ShiftRequestWithJson } from "@shared/api/common/types/merged";
import type { RequestStatus } from "@shared/api/common/types/prisma";
import type { ShiftRequestDTO } from "@shared/api/shift/request/dto";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LuSend } from "react-icons/lu";
import { SiOpenai } from "react-icons/si";
import { TbCalendarCheck } from "react-icons/tb";
import { useSelector } from "react-redux";
import {
	DrawerView,
	useBottomDrawer,
} from "../../../common/context/useBottomDrawer";

const ActionButtons = ({
	status,
	data,
}: {
	status: RequestStatus;
	data: ShiftRequestDTO;
}) => {
	const { darawerOpen } = useBottomDrawer();

	const router = useRouter();

	const gotoAdjustPage = (id: string) =>
		router.push(`/dashboard/shift/adjust/${id}`);

	const { user } = useSelector((state: RootState) => state.user);

	const switchAdjustmentBtnAction = (data: ShiftRequestDTO) => {
		if (user?.role === "STAFF") {
			return router.push(`/shift/submit?shiftRequestId=${data.id}`);
		}
		return gotoAdjustPage(data.id);
	};

	switch (status) {
		case "HOLD":
			return (
				<Link
					href={`/dashboard/shift/create/${data.id}`}
					className="btn btn-outline flex-1 text-gray02 bg-white  font-bold shadow-sm border-gray02 rounded-md"
				>
					{/* <FaRegEdit /> */}
					下書き再開
				</Link>
			);

		case "REQUEST":
			return (
				<>
					<Link
						href={`/shift/submit?shiftRequestId=${data.id}`}
						className={
							"btn flex-1 text-green01 bg-white  font-bold shadow-sm border-green01 rounded-md	 "
						}
					>
						{/* <LuSend /> */}
						提出
					</Link>
				</>
			);

		case "ADJUSTMENT":
			return (
				<button
					type="button"
					className={
						"btn flex-1 text-green01 bg-white  font-bold shadow-sm border-green01 rounded-md	 "
					}
					onClick={() => gotoAdjustPage(data.id)}
				>
					{user?.role === "STAFF" ? "提出データを確認" : "シフト調整"}
				</button>
			);

		case "CONFIRMED":
			return (
				<button
					type="button"
					className={
						"btn flex-1 text-green02 bg-white  font-bold shadow-sm border-green02 rounded-md	 "
					}
					onClick={() => gotoAdjustPage(data.id)}
				>
					完成確認
				</button>
			);

		default:
			return null;
	}
};

export default ActionButtons;
