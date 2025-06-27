"use client";
import type { RequestStatus } from "@shared/common/types/prisma";
import type { ShiftRequest } from "@shared/common/types/prisma";
import { useRouter } from "next/navigation";
import { FaRegEdit } from "react-icons/fa";
import { FaScaleBalanced } from "react-icons/fa6";
import { LuSend } from "react-icons/lu";
import { SiOpenai } from "react-icons/si";
import { TbCalendarCheck } from "react-icons/tb";
import {
	DrawerView,
	type ShiftRequestWithJson,
	useBottomDrawer,
} from "../../../common/context/useBottomDrawer";

const ActionButtons = ({
	status,
	data,
}: {
	status: RequestStatus;
	data: ShiftRequestWithJson;
}) => {
	const { darawerOpen } = useBottomDrawer();
	const router = useRouter();
	const goToShiftPage = (id: string) => router.push(`/dashboard/shift/${id}`);

	switch (status) {
		case "HOLD":
			return (
				<button
					type="button"
					className="btn btn-outline flex-1 text-gray02 bg-white  font-bold shadow-sm border-gray02 rounded-md"
					onClick={() => darawerOpen(DrawerView.CREATE_REQUEST, data)}
				>
					{/* <FaRegEdit /> */}
					下書き再開
				</button>
			);

		case "REQUEST":
			return (
				<>
					<button
						type="button"
						className="btn flex-1 text-green01 bg-white  font-bold shadow-sm border-green01 rounded-md"
						onClick={() => darawerOpen(DrawerView.STATUS, data)}
					>
						<SiOpenai />
						シフト作成
					</button>
					<button
						type="button"
						className="btn flex-1 text-white bg-green01  font-bold shadow-sm border-green01 rounded-md"
						onClick={() => darawerOpen(DrawerView.SUBMIT, data)}
					>
						{/* <LuSend /> */}
						提出
					</button>
				</>
			);

		case "ADJUSTMENT":
			return (
				<button
					type="button"
					className="btn flex-1 text-green01 bg-white  font-bold shadow-sm border-green01 rounded-md"
					onClick={() => goToShiftPage(data.id)}
				>
					シフト調整
				</button>
			);

		case "CONFIRMED":
			return (
				<button
					type="button"
					className="btn flex-1 text-white bg-green02  font-bold shadow-sm border-green02 rounded-md"
					onClick={() => goToShiftPage(data.id)}
				>
					{/* <TbCalendarCheck /> */}
					完成確認
				</button>
			);

		default:
			return null;
	}
};

export default ActionButtons;
