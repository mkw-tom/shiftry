"use client";
import type { RequestStatus } from "@shared/common/types/prisma";
import type { ShiftRequest } from "@shared/common/types/prisma";
import { useRouter } from "next/navigation";
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
					className="btn btn-sm w-28 bg-gray02 text-xs text-white font-bold shadow-sm border-none"
					onClick={() => darawerOpen(DrawerView.CREATE_REQUEST, data)}
				>
					作成再開
				</button>
			);

		case "REQUEST":
			return (
				<>
					<button
						type="button"
						className="btn btn-sm w-28 bg-green03 text-xs text-green02 font-bold shadow-sm border-none"
						onClick={() => darawerOpen(DrawerView.STATUS, data)}
					>
						提出確認・回収
					</button>
					<button
						type="button"
						className="btn btn-sm w-28 bg-green02 text-xs text-white font-bold shadow-sm border-none"
						onClick={() => darawerOpen(DrawerView.SUBMIT, data)}
					>
						シフト提出
					</button>
				</>
			);

		case "ADJUSTMENT":
			return (
				<button
					type="button"
					className="btn btn-sm w-28 bg-blue01 text-xs text-white font-bold shadow-sm border-none"
					onClick={() => goToShiftPage(data.id)}
				>
					調整を見る
				</button>
			);

		case "CONFIRMED":
			return (
				<button
					type="button"
					className="btn btn-sm w-28 bg-orange-400 text-xs text-white font-bold shadow-sm border-none"
					onClick={() => goToShiftPage(data.id)}
				>
					完成確認
				</button>
			);

		default:
			return null;
	}
};

export default ActionButtons;
