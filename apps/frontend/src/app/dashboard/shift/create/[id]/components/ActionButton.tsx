"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { useCreateRequest } from "../context/CreateRequestFormProvider";
import useActionButton from "../hook/useActionButton";

const ActionButton = () => {
	const router = useRouter();
	const {
		step,
		nextStep,
		prevStep,
		formData,
		setFormData,
		shiftPositioins,
		allJobRoles,
	} = useCreateRequest();

	const { gotoAdjustPage } = useActionButton({
		formData,
		setFormData,
		shiftPositioins,
		nextStep,
		allJobRoles,
	});

	const selectDateDisabled =
		!formData.weekStart || !formData.weekEnd || !formData.deadline;
	const registerPositionDisabled = shiftPositioins.length === 0;

	if (step === "select_date") {
		return (
			<div className="fixed bottom-5 left-0 w-full flex justify-center gap-2 px-3 pt-3 bg-white/80 border-t border-gray01 z-50 ">
				<button
					type="button"
					className="btn btn-sm w-full bg-green02 text-white border-none"
					onClick={() => nextStep()}
					disabled={selectDateDisabled}
				>
					次へ
				</button>
			</div>
		);
	}

	if (step === "regist_position") {
		return (
			<div className="fixed bottom-5 left-0 w-full flex justify-center gap-2 px-3 pt-3 bg-white/80 border-t border-gray01 z-50 ">
				<button
					type="button"
					className="btn btn-sm w-1/3 bg-gray02 text-white border-none"
					onClick={prevStep}
				>
					戻る
				</button>
				<button
					type="button"
					className="btn btn-sm w-2/3 bg-green02 text-white border-none"
					onClick={gotoAdjustPage}
					disabled={registerPositionDisabled}
				>
					次へ
				</button>
			</div>
		);
	}
};

export default ActionButton;
