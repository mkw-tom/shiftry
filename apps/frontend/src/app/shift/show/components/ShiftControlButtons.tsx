import type { AssignPositionWithDateInput } from "@shared/api/shift/assign/validations/put";
import type { RequestPositionWithDateInput } from "@shared/api/shift/request/validations/put";
import React from "react";
import { MdAdd } from "react-icons/md";
import { useAdjustShiftForm } from "../context/AdjustShiftFormContextProvider.tsx";
import AutoAssignModal from "./modals/AutoAssignModal";
import SubmitStatusModal from "./modals/SubmitStatusModal";

const ShiftControlButtons = ({
	selectDate,
	openEditAssignPositionModal,
	editAssignPosition,
	openAutoAssignModal,
	openSubmitStatusModal,
}: {
	selectDate: Date;
	openEditAssignPositionModal: (
		position: RequestPositionWithDateInput,
		date: string,
		mode: "new" | "adjust",
	) => void;
	editAssignPosition: AssignPositionWithDateInput;
	openAutoAssignModal: (shiftRequestId: string) => void;
	openSubmitStatusModal: () => void;
}) => {
	const { shiftRequestData } = useAdjustShiftForm();
	return (
		<div className="w-full flex gap-1 items-center justify-center shadow-sm  p-1 bg-white">
			{shiftRequestData.status === "ADJUSTMENT" ? (
				<>
					<button
						type="button"
						className="btn btn-sm bg-white text-green01 font-bold flex-1 border-dashed border-1 border-gray01 shadow-none"
						onClick={() =>
							openEditAssignPositionModal(
								editAssignPosition,
								String(selectDate),
								"new",
							)
						}
					>
						<MdAdd className="text-lg" />
						ポジションを追加
					</button>

					<AutoAssignModal />
					<button
						type="button"
						className="btn btn-sm  border-green01 text-green01 font-bold bg-white shadow-none"
						onClick={() => openAutoAssignModal(shiftRequestData.id)}
					>
						自動割当
					</button>
				</>
			) : (
				<>
					<button
						type="button"
						className="btn btn-sm  border-green01 text-green01 font-bold bg-white shadow-none flex-1"
						onClick={() => openAutoAssignModal(shiftRequestData.id)}
					>
						{/* <AiOutlineOpenAI className="text-[14px]"/> */}
						再調整依頼
					</button>
				</>
			)}

			<button
				type="button"
				className="btn btn-sm border-gray02 text-gray02 font-bold bg-white shadow-none"
				onClick={openSubmitStatusModal}
			>
				提出状況
			</button>
			<SubmitStatusModal
				id="submit-status"
				startDate={shiftRequestData.weekStart}
				endDate={shiftRequestData.weekEnd}
			/>
		</div>
	);
};

export default ShiftControlButtons;
