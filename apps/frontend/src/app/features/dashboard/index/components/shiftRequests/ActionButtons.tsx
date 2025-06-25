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
					className="btn flex-1 font-bold shadow-sm bg-gray02 text-white border-none"
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
						className="btn flex-1 text-green01 bg-white  font-bold shadow-sm border-1 border-green01"
						onClick={() => darawerOpen(DrawerView.STATUS, data)}
					>
						回収・作成
					</button>
					<button
						type="button"
						className="btn flex-1 text-white bg-green01  font-bold shadow-sm border-none"
						onClick={() => darawerOpen(DrawerView.SUBMIT, data)}
					>
						提出
					</button>
				</>
			);

		case "ADJUSTMENT":
			return (
				<button
					type="button"
					className="btn flex-1 font-bold shadow-sm bg-green01 text-white border-none"
					onClick={() => goToShiftPage(data.id)}
				>
					シフト調整
				</button>
			);

		case "CONFIRMED":
			return (
				<button
					type="button"
					className="btn flex-1 font-bold shadow-sm bg-green02 border-none text-white"
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
