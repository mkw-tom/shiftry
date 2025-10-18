import type { AssignPositionWithDateInput } from "@shared/api/shift/assign/validations/put";
import type { RequestPositionWithDateInput } from "@shared/api/shift/request/validations/put";
import React from "react";
import { MdAdd } from "react-icons/md";
import { useAdjustShiftForm } from "../context/AdjustShiftFormContextProvider.tsx";
import { useAiAdjustMode } from "../context/AiAdjustModeProvider";
import AIAssignModal from "./AiModal/AIAssignModal";
import AutoAssignModal from "./modals/AutoAssignModal";
import SubmitStatusModal from "./modals/SubmitStatusModal";

const ShiftControlButtons = ({
	selectDate,
	openEditAssignPositionModal,
	editAssignPosition,
	openSubmitStatusModal,
}: {
	selectDate: Date;
	openEditAssignPositionModal: (
		position: RequestPositionWithDateInput,
		date: string,
		mode: "new" | "adjust",
	) => void;
	editAssignPosition: AssignPositionWithDateInput;
	openSubmitStatusModal: () => void;
}) => {
	const { aiMode } = useAiAdjustMode();
	const { shiftRequestData } = useAdjustShiftForm();

	const openAutoAssignModal = () => {
		const modal = document.getElementById("auto-assign-modal");
		if (modal) {
			(modal as HTMLDialogElement).showModal();
		}
	};
	const openAIAssignModal = () => {
		const modal = document.getElementById("ai-assign-modal");
		if (modal) {
			(modal as HTMLDialogElement).showModal();
		}
	};

	return (
		<div className="w-full flex gap-1 items-center justify-center shadow-sm  p-1 bg-white">
			{shiftRequestData.status === "ADJUSTMENT" ? (
				<>
					<button
						type="button"
						className={`btn btn-sm bg-white text-green01 font-bold flex-1 border-dashed border-1 border-gray01 shadow-none ${aiMode && "opacity-40"}`}
						disabled={aiMode}
						onClick={() =>
							openEditAssignPositionModal(
								editAssignPosition,
								String(selectDate),
								"new",
							)
						}
					>
						<MdAdd className="text-lg" />
						追加
					</button>

					<AIAssignModal />
					<AutoAssignModal />
					<button
						type="button"
						className="btn btn-sm  border-purple-500 text-purple-500 font-bold bg-white shadow-none"
						onClick={() => openAIAssignModal()}
					>
						AI調整
					</button>
					<button
						type="button"
						className={`btn btn-sm  border-green01 text-green01 font-bold bg-white shadow-none ${aiMode && "opacity-40"}`}
						onClick={() => openAutoAssignModal()}
						disabled={aiMode}
					>
						自動割当
					</button>
				</>
			) : (
				<>
					<button
						type="button"
						className="btn btn-sm  border-green01 text-green01 font-bold bg-white shadow-none flex-1"
						onClick={() => openAutoAssignModal()}
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
