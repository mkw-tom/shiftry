"use client";
import type { RootState } from "@/app/redux/store";
import type { ShiftRequestWithJson } from "@shared/api/common/types/merged";
import type { RequestStatus } from "@shared/api/common/types/prisma";
import { useRouter } from "next/navigation";
import { LuSend } from "react-icons/lu";
import { SiOpenai } from "react-icons/si";
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
	data: ShiftRequestWithJson;
}) => {
	const { darawerOpen } = useBottomDrawer();
	const router = useRouter();
	const goToShiftPage = (id: string) => router.push(`/dashboard/shift/${id}`);
	const { user } = useSelector((state: RootState) => state.user);

	const switchAdjustmentBtnAction = (data: ShiftRequestWithJson) => {
		// if (user?.role === "STAFF") {
		// 	return darawerOpen(DrawerView.SUBMIT, data);
		// }
		return goToShiftPage(data.id);
	};

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
						className={
							"btn flex-1 text-green01 bg-white  font-bold shadow-sm border-green01 rounded-md"
						}
						onClick={() => darawerOpen(DrawerView.GENERATE, data)}
					>
						<SiOpenai />
						シフト作成
					</button>
					<button
						type="button"
						className="btn flex-1 text-white bg-green01  font-bold shadow-sm border-green01 rounded-md"
						onClick={() => darawerOpen(DrawerView.SUBMIT, data)}
					>
						<LuSend />
						提出
					</button>
				</>
			);

		case "ADJUSTMENT":
			return (
				<button
					type="button"
					className={
						"btn flex-1 text-green01 bg-white  font-bold shadow-sm border-green01 rounded-md	 "
					}
					onClick={() => switchAdjustmentBtnAction(data)}
				>
					{/* {user?.role === "STAFF" ? "提出データを確認" : "シフト調整"} */}
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
