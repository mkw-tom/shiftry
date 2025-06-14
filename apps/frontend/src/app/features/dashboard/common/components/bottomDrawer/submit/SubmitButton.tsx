import { UpsertSubmittedShiftInputType } from "@shared/shift/submit/validations/put";
import React from "react";

const SubmitButton = ({
	isSubmitDisabled,
	saveSubmitShift,
	submitDataLoading,
	reSubmit,
}: {
	isSubmitDisabled: boolean;
	saveSubmitShift: () => void;
	submitDataLoading: boolean;
	reSubmit: boolean;
}) => {
	return (
		<div className="w-full flex items-center justify-between mx-auto">
			<button
				type="button"
				className="btn flex-1 h-10 shadow-xl rounded-full font-bold text-sm text-white border-none bg-green01"
				disabled={isSubmitDisabled || submitDataLoading}
				onClick={saveSubmitShift}
			>
				{reSubmit ? "再提出" : "提出"}
			</button>
		</div>
	);
};

export default SubmitButton;
